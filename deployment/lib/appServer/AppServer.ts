import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
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
  private appServerRole: iam.Role;
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
    this.createIamRole();
    this.createUserData();
    this.createSecurityGroup();
    this.createServer();
  }

  private createIamRole(): void {
    this.appServerRole = new iam.Role(this, 'AppServerRole', {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore')
      ]
    });
    //grant permission to read the RDS secret
    this.appRds.database.secret!.grantRead(this.appServerRole);
    //add explicit Secrets Manager permissions as backup
    this.appServerRole.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        'secretsmanager:GetSecretValue'
      ],
      resources: [this.appRds.database.secret!.secretArn]
    }));
  }

  private createUserData(): ec2.UserData {
    const userData = ec2.UserData.forLinux();
    this.updateYum(userData);
    this.installGit(userData);
    this.installDocker(userData);
    this.cloneRepo(userData);
    this.createAppYaml(userData);
    this.runApp(userData);
    return userData;
  }

  private updateYum(userData: ec2.UserData): void {
    userData.addCommands('yum update -y');
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

  private installGit(userData: ec2.UserData): void {
    userData.addCommands(
      'echo "Installing Git..."',
      'yum install -y git',
    );
  }

  private cloneRepo(userData: ec2.UserData): void {
    userData.addCommands(
      'echo "Cloning repository..."',
      `cd /home/ec2-user`,
      `git clone ${GITHUB_REPO} app`,
      'chown -R ec2-user:ec2-user /home/ec2-user/app',
      'echo "Repository cloned successfully"'
    );
  }

  private createAppYaml(userData: ec2.UserData): void {
    userData.addCommands(
      'echo "Creating production app.yaml..."',
      'cd /home/ec2-user/app/api',
      'cat > prodApp.yaml << \'EOF\'',
      'services:',
      '  prod-app:',
      '    image: mcr.microsoft.com/dotnet/sdk:8.0',
        '    working_dir: /app/api',
      '    volumes:',
      '      - ..:/app',
      '    ports:',
      '      - "80:80"',
      '    environment:',
      '      - ASPNETCORE_ENVIRONMENT=Production',
      '      - ASPNETCORE_URLS=http://0.0.0.0:80',
      '      - ASPNETCORE_HTTP_PORTS=80',
      '      - ASPNETCORE_HTTPS_PORTS=',
      `      - ConnectionStrings__DefaultConnection=Server=${this.appRds.database.instanceEndpoint.hostname};Port=${this.appRds.database.instanceEndpoint.port};Database=${this.appRds.database.instanceIdentifier};User=admin;Password=PLACEHOLDER_PASSWORD;`,
      `      - RabbitMQ__Host=${this.messageBroker.rabbitMq.instancePrivateIp}`,
      '      - RabbitMQ__Port=5672',
      `      - RabbitMQ__Username=${RABBITMQ_DEFAULT_USER}`,
      `      - RabbitMQ__Password=${RABBITMQ_DEFAULT_PASS}`,
      '      - RabbitMQ__Queue=production-queue',
      '    command: >',
      '      bash -c "',
      '        ### Install Node.js 22',
      '        echo \'Installing Node.js 22...\' &&',
      '        curl -fsSL https://deb.nodesource.com/setup_22.x | bash - &&',
      '        apt-get update && apt-get install -y nodejs &&',
      '        ',
      '        ### Remove old Angular and npm cache (else the angular build fails)',
      '        echo \'Cleaning npm cache and directories...\' &&',
      '        npm cache clean --force &&',
      '        rm -rf /usr/lib/node_modules/@angular* &&',
      '        rm -rf /root/.npm &&',
      '        ',
      '        ### Install Angular dependencies and build UI',
      '        echo \'Building Angular UI...\' &&',
      '        cd /app/client &&',
      '        npm install &&',
      '        echo \'Installing Angular CLI globally...\' &&',
      '        npm install -g @angular/cli --force &&',
      '        npm run build-to-backend &&',
      '        ',
      '        ### Build .NET API',
      '        echo \'Building .NET API...\' &&',
      '        cd /app/api &&',
      '        dotnet restore &&',
      '        ',
      '        ### Install Entity Framework & set it to PATH',
      '        echo \'Installing Entity Framework tools...\' &&',
      '        dotnet tool install --global dotnet-ef --version 8.0.4 &&',
      '        export PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/share/dotnet:/root/.dotnet/tools &&',
      '        ',
      '        ### Verify installations',
      '        echo \'Verifying dotnet and EF tools...\' &&',
      '        which dotnet &&',
      '        which dotnet-ef &&',
      '        dotnet --version &&',
      '        ',
      '        ### Initialize database through EF',
      '        echo \'Initializing database...\' &&',
      '        dotnet ef database update &&',
      '        ',
      '        ### Start the entire app',
      '        echo \'Starting production server on port 80...\' &&',
      '        dotnet run --configuration Release --urls=http://0.0.0.0:80',
      '      "',
      '    restart: unless-stopped',
      '    networks:',
      '      - app-network',
      '',
      'networks:',
      '  app-network:',
      '    driver: bridge',
      'EOF',
      'chown ec2-user:ec2-user prodApp.yaml',
      'chmod 644 prodApp.yaml',
      'echo "Production app.yaml created successfully"'
    );
  }

  private runApp(userData: ec2.UserData): void {
    userData.addCommands(
      'echo "Starting production application..."',
      'cd /home/ec2-user/app/api',
      '',
      '# Get the database password from AWS Secrets Manager',
      `DB_PASSWORD=$(aws secretsmanager get-secret-value --secret-id ${this.appRds.database.secret!.secretArn} --region eu-central-1 --query SecretString --output text | python3 -c "import sys, json; print(json.load(sys.stdin)['password'])")`,
      '',
      '# Replace the placeholder password in prodApp.yaml',
      'python3 -c "',
      'import os, sys',
      'password = os.environ.get(\"DB_PASSWORD\", \"\")',
      'with open(\"prodApp.yaml\", \"r\") as f:',
      '    content = f.read()',
      'content = content.replace(\"PLACEHOLDER_PASSWORD\", password)',
      'with open(\"prodApp.yaml\", \"w\") as f:',
      '    f.write(content)',
      'print(f\"Password replacement completed. Length: {len(password)}\")',
      '" DB_PASSWORD="$DB_PASSWORD"',
      '',
      'sudo -u ec2-user /usr/local/bin/docker-compose -f prodApp.yaml up -d',
      'echo "Production application started successfully"',
      'echo "Application is running on port 80"'
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
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.SMALL), // Upgraded from MICRO to SMALL - MICRO can't handle Docker workloads reliably
      machineImage: ec2.MachineImage.latestAmazonLinux2(),
      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
      vpc: this.vpc,
      securityGroup: this.appServerSecurityGroup,
      keyName: 'MonolithBastionKeyPair',
      role: this.appServerRole,
      userData: this.createUserData(),
    });
  }



}