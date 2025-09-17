import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { RabbitMqProps } from '../types/types';



const user = process.env.RABBITMQ_DEFAULT_USER!;
const pass = process.env.RABBITMQ_DEFAULT_PASS!;



export class RabbitMqServer extends Construct {
  public rabbitMq: ec2.Instance;
  public securityGroup: ec2.SecurityGroup;
  private props: RabbitMqProps;


  constructor(scope: Construct, id: string, props: RabbitMqProps) {
    super(scope, id);
    this.props = props;
    this.init();
  }


  private init() {
    this.createSecurityGroup();
    this.createInstance();
  }

  private createSecurityGroup() {
    this.securityGroup = new ec2.SecurityGroup(this, 'MonolithRabbitMqSG', {
      vpc: this.props.vpc,
      allowAllOutbound: true,
    });
    // restrict to your IP & AppServer for better security in real-world scenario
    this.securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(5672), 'Allow AMQP');
    this.securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(15672), 'Allow RabbitMQ Management UI');
  }

  private createInstance() {
    const userData = ec2.UserData.forLinux();
    userData.addCommands(
      // Update all packages
      'yum update -y',
      // Install Docker
      'yum install -y docker',
      // Start Docker service
      'service docker start',
      // Add ec2-user to the docker group so it can run docker without sudo
      'usermod -a -G docker ec2-user',
      // Download Docker Compose binary
      'curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose',
      // Make Docker Compose executable
      'chmod +x /usr/local/bin/docker-compose',
      // Create the docker-compose file for RabbitMQ with environment variables. Don't indent lines or yaml will be invalid!
      `cat > /home/ec2-user/messageBroker.yaml <<EOF
version: '3.8'

services:
  rabbitmq:
    image: rabbitmq:3-management
    container_name: rabbitmq
    ports:
      - "5672:5672"
      - "15672:15672"
    environment:
      RABBITMQ_DEFAULT_USER: ${user}
      RABBITMQ_DEFAULT_PASS: ${pass}
    networks:
      - rabbitmq_net

networks:
  rabbitmq_net:
    driver: bridge
EOF
`,
      // Set ownership of the compose file to ec2-user
      'chown ec2-user:ec2-user /home/ec2-user/messageBroker.yaml',
      // Change to the home directory
      'cd /home/ec2-user',
      // Start RabbitMQ using Docker Compose in detached mode
      'docker-compose -f messageBroker.yaml up -d'
    );

    this.rabbitMq = new ec2.Instance(this, 'MonolithRabbitMq', {
      vpc: this.props.vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
      machineImage: ec2.MachineImage.latestAmazonLinux2(),
      securityGroup: this.securityGroup,
      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
      keyName: 'MonolithBastionKeyPair',
      userData: userData,
    });
  }

}