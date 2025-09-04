/****************************************************************************************
Create a key-pair before deploying the bastion host, either via AWS Console or AWS CLI:
  $ aws ec2 create-key-pair --key-name MonolithBastionKeyPair
Then add the key-pair name to the BastionHostLinux construct below.
****************************************************************************************/


import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';



export class AppBastion extends Construct {
  private vpc: ec2.Vpc;
  public bastion: ec2.Instance;
  public bastionSecurityGroup: ec2.SecurityGroup;


  constructor(scope: Construct, id: string, vpc: ec2.Vpc) {
    super(scope, id);
    this.vpc = vpc;
    this.init();
  }


  private init() {
    this.createSecurityGroup();
    this.createBastion();
  }

  private createSecurityGroup() {
    // allow outbound traffic from the bastion host
    this.bastionSecurityGroup = new ec2.SecurityGroup(this, 'MonolithBastionSG', {
      vpc: this.vpc,
      allowAllOutbound: true,
    });
    // allow SSH access to the bastion host from anywhere
    this.bastionSecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(), //this should really be just your IP
      ec2.Port.tcp(22),
      'Allow SSH access from anywhere'
    );
  }

  private createBastion() {
    this.bastion = new ec2.Instance(this, 'MonolithBastionInstance', {
      vpc: this.vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
      machineImage: ec2.MachineImage.latestAmazonLinux2(),
      securityGroup: this.bastionSecurityGroup,
      keyName: 'MonolithBastionKeyPair',
      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
    });
  }

}
