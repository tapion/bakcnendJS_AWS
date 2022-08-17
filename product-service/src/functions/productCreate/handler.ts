import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse, errorResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import schema from "./schema";
import { Client } from "pg";

const productCreate: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  let db = null;
  console.log('productCreate', event);
  try {
    const { title, description, price, count } = event.body;
    if (!title || !description || !price || !count)
      throw { message: "Invalid Product structure", statusCode: 400 };
    db = new Client({
      user: process.env.PG_USER,
      host: process.env.PG_HOST,
      database: process.env.PG_DB,
      password: process.env.PG_PASS,
      port: parseInt(process.env.PG_PORT),
    });
    db.connect();
    await db.query('BEGIN');
    let query ="insert into products(title, description, price) values($1, $2, $3) RETURNING id";
    const product = await db.query(query,[title, description, price]);
    query ="insert into stocks (product_id, count) values ($1,$2)";
    await db.query(query,[product.rows[0].id, count]);
    await db.query('COMMIT')
    return formatJSONResponse([]);
  } catch (e) {
    if (db) {
      await db.query("ROLLBACK");
    }
    const errorCode = e?.statusCode ? e.statusCode : 500;
    return errorResponse(e.message, errorCode);
  }
};

export const main = middyfy(productCreate);
