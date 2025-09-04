import { Construct } from 'constructs';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { AppRdsProps } from '../types/types';



export class AppRds extends Construct {
  public database: rds.DatabaseInstance;
  private vpc: ec2.Vpc;
  private bastionSecurityGroup: ec2.SecurityGroup;


  constructor(scope: Construct, id: string, props: AppRdsProps) {
    super(scope, id);
    this.vpc = props.vpc;
    this.bastionSecurityGroup = props.bastionSecurityGroup;
    this.init();
  }


  private init() {
    this.createRdsInstance();
    this.addIngressToBastion();
  }

  private createRdsInstance() {
    this.database = new rds.DatabaseInstance(this, 'MonolithDatabase', {
      engine: rds.DatabaseInstanceEngine.MYSQL,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
      vpc: this.vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },
      multiAz: false,
      allocatedStorage: 20,
      maxAllocatedStorage: 100,
      storageType: rds.StorageType.GP2,
      deletionProtection: false,
      databaseName: 'AppDatabase',
      credentials: rds.Credentials.fromGeneratedSecret('admin') //generates 'admin' & password in AWS Secrets Manager
    });
  }

  private addIngressToBastion() {
    this.database.connections.securityGroups[0].addIngressRule(
      this.bastionSecurityGroup,
      ec2.Port.tcp(3306),
      'Allow MySQL access from Bastion host'
    );
  }

}
