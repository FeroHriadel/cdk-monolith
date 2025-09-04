import * as ec2 from 'aws-cdk-lib/aws-ec2';



// Classes props
export interface AppRdsProps {
  vpc: ec2.Vpc;
  bastionSecurityGroup: ec2.SecurityGroup;
}