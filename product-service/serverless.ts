import type { AWS } from "@serverless/typescript";

import products from "@functions/productList";
import productById from "@functions/productById";
import createProduct from "@functions/productCreate";
import catalogBatchProcess from "@functions/catalogBatchProcess";

const serverlessConfiguration: AWS = {
  service: "backend",
  frameworkVersion: "3",
  plugins: [
    "serverless-auto-swagger",
    "serverless-lift",
    "serverless-offline",
    "serverless-esbuild",
    "serverless-dotenv-plugin",
  ],
  useDotenv: true,
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      PG_USER: '${env:PG_USER}',
      PG_HOST: '${env:PG_HOST}',
      PG_DB: '${env:PG_DB}',
      PG_PASS: '${env:PG_PASS}',
      PG_PORT: '${env:PG_PORT}',
    },
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: ["sqs:*"],
            Resource: [
              {
                "Fn::GetAtt": ["MyQueue", "Arn"],
              },
            ],
          },
          {
            Effect: "Allow",
            Action: ["sns:*"],
            Resource: [
              `arn:aws:sns:us-east-1:761488678750:createProductTopic`,
              'arn:aws:sns:us-east-1:761488678750:temporal'
            ],
          },
        ],
      },
    },
  },
  // import the function via paths
  functions: { products, productById, createProduct, catalogBatchProcess },
  package: { individually: true },
  custom: {
    autoswagger: {
      apiType: "http",
      basePath: "/dev",
      useStage: true,
      typefiles: ["./src/types/product.ts"],
    },
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk", "pg-native"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
    "serverless-offline": {
      httpPort: 4000,
    },
  },
  resources: {
    Resources: {
      MyQueue: {
        Type: "AWS::SQS::Queue",
        Properties: {
          QueueName: "MyQueue",
        },
      },
      createProductTopic: {
        Type: "AWS::SNS::Topic",
        Properties: {
          TopicName: "createProductTopic",
        },
      },
      emailSubscription:{
        Type: "AWS::SNS::Subscription",
        Properties: {
          "Endpoint" : "puntadelanza86@gmail.com",
          "Protocol" : "email",
          "TopicArn" : { "Ref" : "createProductTopic" }
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
