## HOW TO USE THIS


### ENV SETUP
- install nodejs (best use nvm), then node --version (I got 22.11.0)
- download and install aws cli, then aws --version to check if all ok
- go to AWS Console / IAM / Users / Create User / give them admin access
- when created click the user and find Security Credentials tab
- Create access key and copy both values
- aws configure: AccessKeyId, AccessKeySecret, region: eu-central-1, output: json
- install aws cdk: $ npm i -g aws-cdk@2.1028.0, then cdk --version
- in the create a .env in `/deployment` folder and fill it in like this:

```
ACCOUNT_ID=992913607133
REGION=eu-central-1
```

- $ cd deployment
- $ npm i
- $ cdk bootstrap


## MANUAL STEPS
- Create a key-pair before deploying the bastion host, either via AWS Console or AWS CLI. Like this: $ aws ec2 create-key-pair --key-name MonolithBastionKeyPair --region eu-central-1
- Keep the name MonolithBastionKeyPair - it's hardcoded in /lib/bastion/AppBastion.ts - or change it there.
- Save the keypair in a file. If you copied the output of the $ aws ec2 create-key-pair... command then you just need the part from (including) -----BEGIN RSA PRIVATE KEY----- to (including) -----END RSA PRIVATE KEY-----. If you have \n linebreaks there, remove them and put an actual line break (Enter key) in their place


### DEPLOY
- $ cdk deploy


### CONNECT TO BASTION (FROM WINDOWS 11) & DB
- aws console / ec2 / instances / your instance / copy the public ipv4
- aws console / secrets manager / your secret / copy the db password
- aws console / rds / your db / copy the endpoint
- Powershell:$ ssh -i C:\Users\ferdi\Desktop\Dev\AWS\cdkMonolith\deployment\BastionKeyPair.pem ec2-user@3.126.120.166
- in your EC2 install a mysql thing: $ sudo yum install -y mysql
- connect to DB like this: $ mysql -h monolithdeploymentstack-monolithrdsmonolithdatabas-wtxl1rdlc3vj.cfocaic4y8um.eu-central-1.rds.amazonaws.com -u admin -p
- enter the password you copied from secrets manager
- there you are...


