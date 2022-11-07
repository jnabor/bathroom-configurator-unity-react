import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';

import { Construct } from 'constructs';
import { Vpc, InstanceType } from 'aws-cdk-lib/aws-ec2';
import { ApplicationLoadBalancedFargateService } from 'aws-cdk-lib/aws-ecs-patterns';
import { LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs';
import { DockerImageAsset, Platform } from 'aws-cdk-lib/aws-ecr-assets';
import { Role, ManagedPolicy, ServicePrincipal } from 'aws-cdk-lib/aws-iam';

export class SsrWebGlStack extends cdk.Stack {
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
            },
        );

        taskDefinition.addContainer('SsrWebGlContainer', {
            image: ecs.ContainerImage.fromDockerImageAsset(asset),
            logging: logDriver,
            portMappings: [{ containerPort: 8080 }],
            memoryLimitMiB: 8192,
            cpu: 1024,
            gpuCount: 1,
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

        new cdk.CfnOutput(this, 'Image URI', { value: asset.imageUri });
        new cdk.CfnOutput(this, 'Image Repository', {
            value: asset.repository.repositoryName,
        });
        new cdk.CfnOutput(this, 'Log Group', {
            value: logGroup.logGroupName,
        });
        new cdk.CfnOutput(this, 'Endpoint', {
            value: crsService.loadBalancer.loadBalancerDnsName,
        });
    }
}
