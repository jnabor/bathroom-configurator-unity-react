import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';

import { Construct } from 'constructs';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { ApplicationLoadBalancedFargateService } from 'aws-cdk-lib/aws-ecs-patterns';
import { LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs';
import { DockerImageAsset } from 'aws-cdk-lib/aws-ecr-assets';
import { Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Distribution, OriginProtocolPolicy  } from 'aws-cdk-lib/aws-cloudfront';
import { HttpOrigin } from 'aws-cdk-lib/aws-cloudfront-origins'
import { Duration } from 'aws-cdk-lib';

export class SsrWebGlEcsStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const vpc = new Vpc(this, 'SsrWebGlVpc', {
            maxAzs: 2,
        });

        const cluster = new ecs.Cluster(this, 'SsrWebGl  Cluster', {
            vpc,
        });

        const role = new Role(this, 'SsrWebGlRole', {
            assumedBy: new ServicePrincipal('ecs-tasks.amazonaws.com'),
        });

        const asset = new DockerImageAsset(this, 'SsrWebGlImage', {
            directory: '../ssr-webgl',
        });

        const logGroup = new LogGroup(this, 'SsrWebGlLogGroup', {
            retention: RetentionDays.THREE_MONTHS,
        });

        const logDriver = new ecs.AwsLogDriver({
            streamPrefix: `ssr-webgl`,
            logGroup,
        });

        const taskDefinition = new ecs.FargateTaskDefinition(
            this,
            'SsrWebGlTaskDef',
            {
                taskRole: role,
                cpu: 1024,
                memoryLimitMiB: 2048
            },
        );

        taskDefinition.addContainer('SsrWebGlContainer', {
            image: ecs.ContainerImage.fromDockerImageAsset(asset),
            logging: logDriver,
        });

        taskDefinition?.defaultContainer?.addPortMappings({
            containerPort: 80,
        });

        const crsService = new ApplicationLoadBalancedFargateService(
            this,
            'SsrWebGlService',
            {
                cluster,
                taskDefinition,
                desiredCount: 1,
                serviceName: 'SsrWebGlService',
                healthCheckGracePeriod: cdk.Duration.minutes(5),
            },
        );

        crsService.service.autoScaleTaskCount({
            minCapacity: 1,
            maxCapacity: 4,
        });

        crsService.targetGroup.configureHealthCheck({
            interval: cdk.Duration.minutes(5),
            timeout: cdk.Duration.seconds(30),
            unhealthyThresholdCount: 2,
            healthyThresholdCount: 5,
            path: '/',
            healthyHttpCodes: '200',
        });

        const origin = new HttpOrigin(crsService.loadBalancer.loadBalancerDnsName, {
            protocolPolicy: OriginProtocolPolicy.MATCH_VIEWER,
            connectionAttempts: 3,
            connectionTimeout: Duration.seconds(10),
            keepaliveTimeout: Duration.seconds(30)
          });

        const distribution = new Distribution(this, 'CrsDist', {
            defaultBehavior: { origin }
          });

        new cdk.CfnOutput(this, 'Image URI', { value: asset.imageUri });
        new cdk.CfnOutput(this, 'Image Repository', {
            value: asset.repository.repositoryName,
        });
        new cdk.CfnOutput(this, 'Log Group', {
            value: logGroup.logGroupName,
        });
        new cdk.CfnOutput(this, 'Load Balancer', {
            value: crsService.loadBalancer.loadBalancerDnsName,
        });
        new cdk.CfnOutput(this, 'Endpoint', {
            value: distribution.domainName,
        });
    }
}
