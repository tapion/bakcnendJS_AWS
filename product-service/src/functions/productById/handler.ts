import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse, errorResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import schema from "./schema";
import { Client } from "pg";

const productById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  console.log('productById', event);
  try {
    const { productId } = event.pathParameters;
    const db = new Client({
      user: process.env.PG_USER,
      host: process.env.PG_HOST,
      database: process.env.PG_DB,
      password: process.env.PG_PASS,
      port: parseInt(process.env.PG_PORT),
    });
    db.connect();

    const query = {
      name: "fetch-productAndStock",
      text: "select s.count, p.id, p.title, p.description, p.price  from products p inner join stocks s on s.product_id = p.id WHERE p.id = $1",
      values: [productId],
    };
    const data = await db.query(query);

    return formatJSONResponse(data.rows);
  } catch (e) {
    const errorCode = e?.statusCode ? e.statusCode : 500;
    return errorResponse(e.message, errorCode);
  }
};

export const main = middyfy(productById);
