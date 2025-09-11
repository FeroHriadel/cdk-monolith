import * as ec2 from 'aws-cdk-lib/aws-ec2';



// Constructs props
export interface AppRdsProps {
  vpc: ec2.Vpc;
  bastionSecurityGroup: ec2.SecurityGroup;
}

export interface RabbitMqProps {
  vpc: ec2.Vpc;
}

export interface AppServerProps {
  vpc: ec2.Vpc;
}