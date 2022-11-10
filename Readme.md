# Unity URP WebGl with Cloud deployment options
This project uses various options to host a webgl application.

## Deployed in Web
The unity is compiled to WebGL, deployed and rendered in a webpage

folders:
unity project: unity
front-end project: web


## Deployed in Rendered in Server (AWS ECS)
The unity is compiled to WebGL, and is rendered in server using puppeteer.
The server serves static images to a webpage.

The deployment type is AWS ECS using AWS CDK.

folders:
unity project: unity
front-end project: web-ssr
back-end: server/ssr-webgl
cdk: server/cdk - use command `npm run deploy-ecs`


## Deployed in Rendered in Server (AWS ECS)
The unity is compiled to WebGL, and is rendered in server using puppeteer.
The server serves static images to a webpage.

The deployment type is AWS EC2 using AWS CDK.

folders:
unity project: unity
front-end project: web-ssr
back-end: server/ssr-webgl
cdk: server/cdk - use command `npm run deploy-ec2`
