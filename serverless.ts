import type { AWS } from '@serverless/typescript';

import products from '@functions/productList';
import productById from '@functions/productById';
import createProduct from '@functions/productCreate';

const serverlessConfiguration: AWS = {
  service: 'backend',
  frameworkVersion: '3',
  plugins: ['serverless-auto-swagger','serverless-offline' ,'serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      PG_USER: 'postgres',
      PG_HOST: '',
      PG_DB: 'db1',
      PG_PASS: '',
      PG_PORT: '5432',
    },
    iam: {
      role: 'arn:aws:iam::761488678750:role/Call_RD_FROM_Lambdas',
    },
    vpc: {
      securityGroupIds: ['sg-096d74b99870444a4'],
      subnetIds: ['subnet-09a4fec2bbac5b478','subnet-00071adc1f1cf05e2','subnet-0154b9b014df052a7', 'subnet-09a02f60289901a13', 'subnet-0aabcee66901821ed', 'subnet-09c084febb1bcb984']
    }
  },
  // import the function via paths
  functions: { products, productById, createProduct },
  package: { individually: true },
  custom: {
    autoswagger:{
      apiType: 'http',
      basePath: '/dev',
      useStage: true,
      typefiles: ['./src/types/product.ts']
    },
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk','pg-native'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    'serverless-offline': {
      httpPort: 4000
    }
  },
};

module.exports = serverlessConfiguration;
