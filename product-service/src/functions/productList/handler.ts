import {
  errorResponse,
  ValidatedEventAPIGatewayProxyEvent,
} from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { Client } from "pg";

const productList: ValidatedEventAPIGatewayProxyEvent<null> = async (event) => {
  console.log('productList', event);
  try {
    const db = new Client({
      user: process.env.PG_USER,
      host: process.env.PG_HOST,
      database: process.env.PG_DB,
      password: process.env.PG_PASS,
      port: parseInt(process.env.PG_PORT),
    });
    db.connect();
    const data = await db.query(
      "select s.count, p.id, p.title, p.description, p.price  from products p inner join stocks s on s.product_id = p.id order by p.title"
    );
    return await formatJSONResponse(data.rows);
  } catch (e) {
    const errorCode = e?.statusCode ? e.statusCode : 500;
    return errorResponse(e.message, errorCode);
  }
};
export const main = middyfy(productList);
