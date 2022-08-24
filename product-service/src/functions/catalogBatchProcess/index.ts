import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.catalogBatchProcess`,
  events: [
    {
      sqs: {
        arn: {
          'Fn::GetAtt': ['MyQueue','Arn']
        },
        batchSize: 5
      },
    },
  ],
};
