import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import products from '@constants/products.json';

const productList: ValidatedEventAPIGatewayProxyEvent<null> = async (event) => {
  return await formatJSONResponse(products);
};
export const main = middyfy(productList);
