import { errorResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
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

const catalogBatchProcess = async (event: SQSEvent) => {
  const sns = new SNSClient({ region: "us-east-1" });
  console.log("catalogBatchProcess", event);
  let snsMessage = "";
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
    snsMessage = `There was created ${productsCreated} products`;
    const snsPrams: PublishCommandInput = {
      Subject: "This is a test",
      Message: snsMessage,
      TopicArn,
      MessageAttributes: {
        maxPrice: {
          DataType: "Number",
          StringValue: "10",
        },
      },
    };
    console.log("snsPrams", snsPrams);
    console.log("sns", sns);
    const command = new PublishCommand(snsPrams);
    console.log("command", command);
    await sns.send(command);
    console.log("successSns como que se envio");
  } catch (e) {
    console.log("Paso un error ", e);
    const errorCode = e?.statusCode ? e.statusCode : 500;
    snsMessage = `There was an error creating products`;
    return errorResponse(e.message, errorCode);
  }
  // finally {
  //   // const snsPrams = {
  //   //   TopicArn,
  //   //   Message: snsMessage,
  //   // };
  //   // console.log("snsPrams", snsPrams);
  //   // const command = new PublishCommand(snsPrams);
  //   // const successSns = await sns.send(command);
  //   // console.log("successSns", successSns);
  // }
};

export const main = middyfy(catalogBatchProcess);
