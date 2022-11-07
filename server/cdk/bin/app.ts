#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { SsrWebGlStack } from '../lib/ssr-webgl-stack';

const accountId = process.env.CDK_DEFAULT_ACCOUNT || '';
const accountRegion = process.env.CDK_DEFAULT_REGION || '';

interface SsrWebGlProps extends cdk.StackProps {
}

const app = new cdk.App();

const stackProps: SsrWebGlProps = {
    env: { account: accountId, region: accountRegion },
};

const ssrWebGlStack = new SsrWebGlStack(app, 'SsrWebGlStack', { ...stackProps });
cdk.Tags.of(ssrWebGlStack).add("CRS Deploy Type", "ECS");
cdk.Tags.of(ssrWebGlStack).add("CRS Cost", "CRS SSR WebGl");