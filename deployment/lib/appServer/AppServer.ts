import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { AppServerProps } from '../types/types';
import * as dotenv from 'dotenv';
dotenv.config();



const GITHUB_REPO = process.env.GITHUB_REPO || 'NO_REPO_PROVIDED';



export class AppServer extends Construct {
  public appServer: ec2.Instance;
  public appServerSecurityGroup: ec2.SecurityGroup;
  private vpc: ec2.Vpc;



  constructor(scope: Construct, id: string, props: AppServerProps) {
    super(scope, id);
    this.vpc = props.vpc;
    this.init();
  }


  private init() {
    this.createSecurityGroup();
    this.createServer();
  }

  private createSecurityGroup() {
    this.appServerSecurityGroup = new ec2.SecurityGroup(this, 'MonolithAppServerSG', {
      vpc: this.vpc,
      allowAllOutbound: true,
    });
  }

  private createServer() {
    const userData = ec2.UserData.forLinux();
    userData.addCommands(
      'sudo yum update -y',
      'sudo yum install -y git',
      'curl -sL https://rpm.nodesource.com/setup_22.x | bash -',
      'yum install -y nodejs',
      'yum install -y dotnet-sdk-8.0',
      'cd /home/ec2-user',
      `git clone ${GITHUB_REPO}`,
      'cd cdk-monolith/client',
      'npm install',
      'npm run build-to-backend',
      'cd ../api',
      // add more
    );

    this.appServer = new ec2.Instance(this, 'MonolithAppServer', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
      machineImage: ec2.MachineImage.latestAmazonLinux2(),
      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
      vpc: this.vpc,
      securityGroup: this.appServerSecurityGroup,
      userData: userData,
    });
    // No ingress rules for now (add ALB rule later, when ALB is created)
  }

}