import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import products from '@constants/products.json';
import schema from './schema';

const productList: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const { productId } = event.pathParameters;
  const result = products.filter(prod => prod.id === productId);

  return formatJSONResponse(result);
};

export const main = middyfy(productList);
