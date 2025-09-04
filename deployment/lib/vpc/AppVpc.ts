import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';



export class AppVpc extends Construct {
  public vpc: ec2.Vpc;


  constructor(scope: Construct, id: string) {
    super(scope, id);
    this.init();
  }


  private init() {
    this.createVpc();
  }

  private createVpc() {
    this.vpc = new ec2.Vpc(this, 'AppVpc', {
      maxAzs: 2,
      subnetConfiguration: [
        {
          cidrMask: 24, //how many IPs will subnet have (the higher the number, the less IPs)
          name: 'public',
          subnetType: ec2.SubnetType.PUBLIC, //for EC2
        },
        {
          cidrMask: 24,
          name: 'private',
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS, //for RDS
        },
      ],
      natGateways: 1, //needed for private subnets to access the internet
    });
  }

}
