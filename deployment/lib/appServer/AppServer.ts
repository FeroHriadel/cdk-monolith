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
      this.yumUpdate(),
      this.installGit(),
      ...this.installNginx(),
      this.installDocker(),
      ...this.installNodejs(),
      this.installDotnet(),
      ...this.cloneRepo(),
      ...this.buildClient(),
      ...this.setupAppsettingsJson(),
      this.startApi(),
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

    private yumUpdate() {
    return 'sudo yum update -y';
  }

  private installGit() {
    return 'sudo yum install -y git';
  }

  private installNginx(): string[] {
    return [
      'sudo yum install -y nginx',
      'sudo systemctl enable nginx',
      'sudo systemctl start nginx',
      `sudo tee /etc/nginx/conf.d/dotnet.conf > /dev/null <<'EOF'
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass         http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection keep-alive;
        proxy_set_header   Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
    }
}
EOF`,
      'sudo systemctl restart nginx',
    ];
  }

  private installDocker() {
    return 'curl -sL https://rpm.nodesource.com/setup_22.x | bash -'
  }

  private installNodejs(): string[] {
    return [
      'curl -sL https://rpm.nodesource.com/setup_22.x | sudo bash -',
      'sudo yum install -y nodejs'
    ];
  }

  private installDotnet() {
    return 'sudo yum install -y dotnet-sdk-8.0';
  }

  private cloneRepo(): string[] {
    return [
      'cd /home/ec2-user',
      `git clone ${GITHUB_REPO}`,
    ];
  }

  private buildClient(): string [] {
    return [
      'cd cdk-monolith/client',
      'npm install',
      'npm run build-to-backend -y'
    ];
  }

  private setupAppsettingsJson(): string[] {
    const rdsSecret = this.appRds.database.secret;
    const rdsEndpoint = this.appRds.database.dbInstanceEndpointAddress;
    const rdsUsername = rdsSecret?.secretValueFromJson('username').unsafeUnwrap() ?? '';
    const rdsPassword = rdsSecret?.secretValueFromJson('password').unsafeUnwrap() ?? '';
    const rabbitMqHost = this.messageBroker.rabbitMq.instancePrivateIp;
    const rabbitMqUser = RABBITMQ_DEFAULT_USER;
    const rabbitMqPass = RABBITMQ_DEFAULT_PASS;

    return [
      "echo 'export ASPNETCORE_ENVIRONMENT=Production' | sudo tee /etc/profile.d/aspnetcore_env.sh",
      'cd ../api',
      `cat > /home/ec2-user/cdk-monolith/api/appsettings.json <<EOF
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "ConnectionStrings": {
    "DefaultConnection": "Server=${rdsEndpoint};Port=3306;Database=mydatabase;User=${rdsUsername};Password=${rdsPassword};"
  },
  "RabbitMQ": {
    "Host": "${rabbitMqHost}",
    "Port": 5672,
    "Username": "${rabbitMqUser}",
    "Password": "${rabbitMqPass}",
    "Queue": "my-queue"
  },
  "JwtCookie": {
    "Secure": true
  }
}
EOF`,
    ];
  }

  private startApi(): string {
    return 'nohup dotnet run --urls "http://localhost:5000" > /dev/null 2>&1 &';
  }

}