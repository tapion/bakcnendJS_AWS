import { errorResponse } from "@libs/api-gateway";
import { Client } from "pg";
import { SQSEvent } from "aws-lambda";
import { Product } from "../../types/product";
import {
  SNSClient,
  PublishCommand,
  PublishCommandInput,
} from "@aws-sdk/client-sns";

const db = new Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DB,
  password: process.env.PG_PASS,
  port: parseInt(process.env.PG_PORT),
});
db.connect();

const TopicArn = "arn:aws:sns:us-east-1:761488678750:createProductTopic";
const sns = new SNSClient({ region: "us-east-1" });

export const catalogBatchProcess = async (event: SQSEvent) => {
  console.log("catalogBatchProcess", event);
  try {
    let productsCreated = 0;
    await Promise.all(
      event.Records.map(async (csvValue) => {
        const newProduct: Product = JSON.parse(csvValue.body);
        await db.query("BEGIN");
        let query =
          "insert into products(title, description, price) values($1, $2, $3) RETURNING id";
        const product = await db.query(query, [
          newProduct.title,
          newProduct.description,
          newProduct.price,
        ]);
        query = "insert into stocks (product_id, count) values ($1,$2)";
        await db.query(query, [product.rows[0].id, newProduct.count]);
        await db.query("COMMIT");
        productsCreated++;
      })
    );
    const snsPrams: PublishCommandInput = {
      Subject: "Products created",
      Message: `There was created ${productsCreated} products`,
      TopicArn,
      MessageAttributes: {
        maxPrice: {
          DataType: "Number",
          StringValue: "10",
        },
      },
    };
    const command = new PublishCommand(snsPrams);
    await sns.send(command);
  } catch (e) {
    const errorCode = e?.statusCode ? e.statusCode : 500;
    return errorResponse(e.message, errorCode);
  }
};
