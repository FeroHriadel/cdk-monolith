import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { RabbitMqProps } from '../types/types';



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
    // restrict to your IP for better security
    this.securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(5672), 'Allow AMQP');
    this.securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(15672), 'Allow RabbitMQ Management UI');
  }

  private createInstance() {
    const userData = ec2.UserData.forLinux();
    userData.addCommands(
      'yum update -y',
      'amazon-linux-extras install epel -y',
      'yum install -y erlang socat',
      'yum install -y wget',
      'wget https://github.com/rabbitmq/rabbitmq-server/releases/download/v3.13.1/rabbitmq-server-3.13.1-1.el8.noarch.rpm',
      'yum install -y rabbitmq-server-3.13.1-1.el8.noarch.rpm',
      'systemctl enable rabbitmq-server',
      'systemctl start rabbitmq-server',
      'rabbitmq-plugins enable rabbitmq_management',
      'rabbitmqctl add_user devuser devpass',
      'rabbitmqctl set_user_tags devuser administrator',
      'rabbitmqctl set_permissions -p / devuser ".*" ".*" ".*"'
    );
    
    this.rabbitMq = new ec2.Instance(this, 'MonolithRabbitMq', {
      vpc: this.props.vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
      machineImage: ec2.MachineImage.latestAmazonLinux2(),
      securityGroup: this.securityGroup,
      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
      userData: userData,
    });
  }

}