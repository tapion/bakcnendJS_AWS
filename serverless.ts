import type { AWS } from '@serverless/typescript';

import products from '@functions/productList';
import productById from '@functions/productById';
// import hello from '@functions/hello';

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
    },
  },
  // import the function via paths
  functions: { products, productById },
  package: { individually: true },
  custom: {
    autoswagger:{
      useStage: true,
      typefiles: ['./src/types/product.ts']
    },
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
