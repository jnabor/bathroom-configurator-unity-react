import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

import { Construct } from 'constructs';

import { Role, ServicePrincipal, ManagedPolicy } from 'aws-cdk-lib/aws-iam';
import { Bucket, BlockPublicAccess } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { IpAddresses } from 'aws-cdk-lib/aws-ec2';

export class SsrWebGlEc2Stack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const cidrBlock = ec2.Vpc.DEFAULT_CIDR_RANGE;

        const bucket = new Bucket(this, 'SsrWebGlBucket', {
            blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
        });

        new BucketDeployment(this, 'SsrWebGlS3Deployment', {
            sources: [Source.asset('./ssr-webgl')],
            destinationBucket: bucket,
            destinationKeyPrefix: 'ssr-webgl',
        });

        const vpc = new ec2.Vpc(this, 'SsrWebGlVpc', {
            ipAddresses: IpAddresses.cidr(cidrBlock),
            subnetConfiguration: [
                {
                    subnetType: ec2.SubnetType.PUBLIC,
                    name: 'SsrWebGlPublic',
                },
            ],
        });

        const sg = new ec2.SecurityGroup(this, 'SsrWebGlSecurityGroup', {
            vpc,
            securityGroupName: 'ssr-webgl-sg',
            description: 'Allow specific access to ec2 instances',
            allowAllOutbound: true,
        });

        sg.addIngressRule(
            ec2.Peer.anyIpv4(),
            ec2.Port.tcp(80),
            'allow ingress http traffic',
        );
        sg.addIngressRule(
            ec2.Peer.anyIpv4(),
            ec2.Port.tcp(22),
            'allow ingress ssh traffic',
        );
        sg.addIngressRule(
            ec2.Peer.ipv4(cidrBlock),
            ec2.Port.tcp(8080),
            'custom tcp for render server',
        );

        const role = new Role(this, 'Ec2Role', {
            assumedBy: new ServicePrincipal('ec2.amazonaws.com'),
            managedPolicies: [
                ManagedPolicy.fromAwsManagedPolicyName(
                    'AmazonS3ReadOnlyAccess',
                ),
                ManagedPolicy.fromAwsManagedPolicyName(
                    'CloudWatchLogsFullAccess',
                ),
            ],
        });

        /* use nvidia gaming pc - ubuntu 18.04
           https://aws.amazon.com/marketplace/pp/prodview-p64lyuknl2pys?sr=0-1&ref_=beagle&applicationId=AWS-EC2-Console
        */
        const ami = ec2.MachineImage.lookup({
            name: 'nv-ubuntu-18-lts-cloudGaming-510.68.02-v202204250312-offer-31487f48-b87f-4b97-ac6b-df34a9569256',
            filters: {
                architecture: ['x86_64'],
            },
        });

        /*
        const ami = ec2.MachineImage.latestAmazonLinux({
            generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
            edition: ec2.AmazonLinuxEdition.STANDARD,
            virtualization: ec2.AmazonLinuxVirt.HVM,
            storage: ec2.AmazonLinuxStorage.GENERAL_PURPOSE,
            cpuType: ec2.AmazonLinuxCpuType.X86_64,
          });
          */

        const instance = new ec2.Instance(this, 'SsrWebGlInstance', {
            vpc,
            role,
            vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
            instanceType: ec2.InstanceType.of(
                ec2.InstanceClass.G4DN,
                ec2.InstanceSize.XLARGE,
            ),
            securityGroup: sg,
            machineImage: ami,
        });

        instance.userData.addCommands(
            'exec > >(tee /var/log/user-data.log|logger -tt user-data -s 2>/dev/console) 2>&1',
            'echo USER DATA START',
            ...baseCommands,
            'rm -rf ssr-webgl',
            'mkdir ssr-webgl',
            `aws s3 cp s3://${bucket.bucketName}/ssr-webgl ssr-webgl --recursive`,
            'cd ssr-webgl',
            'npm install',
            'npm run build',
            'npm run start',
            'echo USER DATA END',
        );

        new cdk.CfnOutput(this, 'bucketName', { value: bucket.bucketName });
        new cdk.CfnOutput(this, 'ec2PublicIp', {
            value: instance.instancePublicIp,
        });
        new cdk.CfnOutput(this, 'ec2PublicDnsName', {
            value: instance.instancePublicDnsName,
        });
    }
}

const baseCommands = [
    'yum -y update',
    'yum install -y awslogs',
    'systemctl enable awslogsd.service',
    'systemctl start awslogsd',
    'aws logs create-log-group --log-group-name block-crs --region us-east-1',
    "sed -i 's/us-east-1/g' /etc/awslogs/awscli.conf",
    'iptables -A PREROUTING -t nat -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 8080',
    'iptables -A INPUT -p tcp -m tcp --sport 80 -j ACCEPT',
    'iptables -A OUTPUT -p tcp -m tcp --dport 80 -j ACCEPT',
];
