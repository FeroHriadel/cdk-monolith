import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { AppServerProps } from '../types/types';



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
    this.appServer = new ec2.Instance(this, 'MonolithAppServer', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
      machineImage: ec2.MachineImage.latestAmazonLinux2(),
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
      vpc: this.vpc,
      securityGroup: this.appServerSecurityGroup,
    });
    // No ingress rules for now (add ALB rule later, when ALB is created)
  }
}