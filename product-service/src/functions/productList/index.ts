// import schema from './schema';
import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products',
        responses: {
          200: {
            description: 'This return all the products in the stock',
            bodyType: 'Products',
          }
        }
      },
    },
  ],
};
