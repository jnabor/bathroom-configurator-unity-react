#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { SsrWebGlEcsStack } from '../lib/ssr-webgl-ecs-stack';
import { SsrWebGlEc2Stack } from '../lib/ssr-webgl-ec2-stack';

const accountId = process.env.CDK_DEFAULT_ACCOUNT || '';
const accountRegion = process.env.CDK_DEFAULT_REGION || '';

interface SsrWebGlProps extends cdk.StackProps {
}

const app = new cdk.App();

const stackProps: SsrWebGlProps = {
    env: { account: accountId, region: accountRegion },
};

const ssrWebGlEcsStack = new SsrWebGlEcsStack(app, 'SsrWebGlEcsStack', { ...stackProps });
cdk.Tags.of(ssrWebGlEcsStack).add("Deploy Type", "ECS");
cdk.Tags.of(ssrWebGlEcsStack).add("Cost", "ECS SSR WebGl");

const ssrWebGlEc2Stack = new SsrWebGlEcsStack(app, 'SsrWebGlEc2Stack', { ...stackProps });
cdk.Tags.of(ssrWebGlEc2Stack).add("Deploy Type", "EC2");
cdk.Tags.of(ssrWebGlEc2Stack).add("Cost", "EC@ SSR WebGl");