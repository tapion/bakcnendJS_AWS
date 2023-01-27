import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        cors: true,
        path: 'import',
        request: {
          parameters: {
            querystrings: {
              name : true
            }
          }
        },
        authorizer: {
          arn : 'arn:aws:lambda:us-east-1:761488678750:function:authorization-service-dev-basicAuthorizer',
          type: 'token',
        }
      },
    },
  ],
};
