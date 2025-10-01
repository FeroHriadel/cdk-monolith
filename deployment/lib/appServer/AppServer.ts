import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { AppServerProps } from '../types/types';
import * as dotenv from 'dotenv';
import { AppRds } from '../rds/AppRds';
import { RabbitMqServer } from '../rabbitMq/RabbitMqServer';
dotenv.config();



const GITHUB_REPO = process.env.GITHUB_REPO || 'NO_REPO_PROVIDED';
const RABBITMQ_DEFAULT_USER = process.env.RABBITMQ_DEFAULT_USER || 'NO_USER_PROVIDED';
const RABBITMQ_DEFAULT_PASS = process.env.RABBITMQ_DEFAULT_PASS || 'NO_PASS_PROVIDED';



export class AppServer extends Construct {
  public appServer: ec2.Instance;
  public appServerSecurityGroup: ec2.SecurityGroup;
  private vpc: ec2.Vpc;
  private appRds: AppRds;
  private messageBroker: RabbitMqServer;


  constructor(scope: Construct, id: string, props: AppServerProps) {
    super(scope, id);
    this.vpc = props.vpc;
    this.appRds = props.appRds;
    this.messageBroker = props.messageBroker;
    this.init();
  }


  private init() {
    this.createUserData();
    this.createSecurityGroup();
    this.createServer();
  }

  private createUserData(): ec2.UserData {
    const userData = ec2.UserData.forLinux();
    this.updateYum(userData);
    this.installGit(userData);
    this.installDocker(userData);
    return userData;
  }

  private updateYum(userData: ec2.UserData): void {
    userData.addCommands('yum update -y');
  }

  private installGit(userData: ec2.UserData): void {
    userData.addCommands(
      'echo "Installing Git..."',
      'yum install -y git',
    );
  }

  private installDocker(userData: ec2.UserData): void {
    userData.addCommands(
      'echo "Installing Docker..."',
      'yum install -y docker',
      'systemctl start docker',
      'systemctl enable docker',
      'usermod -a -G docker ec2-user',
      'echo "Installing Docker Compose..."',
      'curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose',
      'chmod +x /usr/local/bin/docker-compose',
    );
  }

  private createSecurityGroup() {
    //allow outbound traffic
    this.appServerSecurityGroup = new ec2.SecurityGroup(this, 'MonolithAppServerSG', {
      vpc: this.vpc,
      allowAllOutbound: true,
    });
    //allow http ingress on port 80
    this.appServerSecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(80),
      'Allow HTTP access to app'
    );
    //allow SSH from anywhere (0.0.0.0/0). For production, use your IP instead.
    this.appServerSecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(22),
      'Allow SSH access'
    );
  }

  private createServer() {
    this.appServer = new ec2.Instance(this, 'MonolithAppServer', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
      machineImage: ec2.MachineImage.latestAmazonLinux2(),
      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
      vpc: this.vpc,
      securityGroup: this.appServerSecurityGroup,
      keyName: 'MonolithBastionKeyPair',
      userData: this.createUserData(),
    });
  }

}