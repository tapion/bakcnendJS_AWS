import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

const products: ValidatedEventAPIGatewayProxyEvent<null> = async (event) => {
  return formatJSONResponse({
    message: `products, welcome to the exciting Serverless world!`,
    event,
  });
};

export const main = middyfy(products);
