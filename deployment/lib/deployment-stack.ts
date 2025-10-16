import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { AppVpc } from './vpc/AppVpc';
import { AppRds } from './rds/AppRds';
import { AppBastion } from './bastion/AppBastion';
import { RabbitMqServer } from './rabbitMq/RabbitMqServer';
import { AppServer } from './appServer/AppServer';



export class DeploymentStack extends cdk.Stack {
  private appVpc: AppVpc;
  private appBastion: AppBastion;
  private appRds: AppRds;
  private appServer: AppServer;
  private messageBroker: RabbitMqServer;


  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    this.init();
  }


  private init() {
    this.createVpc();
    this.createBastion();
    this.createRds();
    this.createMessageBroker();
    this.createAppServer();
    this.allowAppServerInRDS(); // Allow AppServer to connect to RDS after both are created
  }

  private createVpc() {
    this.appVpc = new AppVpc(this, 'MonolithVpc');
  }

  private createBastion() {
    this.appBastion = new AppBastion(this, 'MonolithBastion', this.appVpc.vpc);
  }

  private createRds() {
    this.appRds = new AppRds(this, 'MonolithRds', {
      vpc: this.appVpc.vpc,
      bastionSecurityGroup: this.appBastion.bastionSecurityGroup
    });
  }

  private createMessageBroker() {
    this.messageBroker = new RabbitMqServer(this, 'MonolithRabbitMq', { vpc: this.appVpc.vpc });
  }

  private createAppServer() {
    this.appServer = new AppServer(this, 'AppServer', { 
      vpc: this.appVpc.vpc,
      appRds: this.appRds,
      messageBroker: this.messageBroker
    });
  }

  private allowAppServerInRDS() {
    // Add ingress rule to RDS security group to allow connections from AppServer
    this.appRds.database.connections.securityGroups[0].addIngressRule(
      this.appServer.appServerSecurityGroup,
      ec2.Port.tcp(3306),
      'Allow MySQL access from App Server'
    );
  }


}
