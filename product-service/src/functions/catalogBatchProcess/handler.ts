import { errorResponse } from "@libs/api-gateway";
import { createProduct } from '../../providers/database';
import { SQSEvent } from "aws-lambda";
import { Product } from "../../types/product";
import {
  SNSClient,
  PublishCommand,
  PublishCommandInput,
} from "@aws-sdk/client-sns";


const TopicArn = "arn:aws:sns:us-east-1:761488678750:createProductTopic";

export const catalogBatchProcess = async (event: SQSEvent) => {
  console.log("catalogBatchProcess", event);
  const sns = new SNSClient({ region: "us-east-1" });
  try {
    let productsCreated = 0;
    let prices = 0;
    await Promise.all(
      event.Records.map(async (csvValue) => {
        const newProduct: Product = JSON.parse(csvValue.body);
        await createProduct(newProduct);
        productsCreated++;
        prices = prices + parseInt(newProduct.price.toString());
      })
    );
    const snsPrams: PublishCommandInput = {
      Subject: "Products created",
      Message: `There was created ${productsCreated} products`,
      TopicArn,
      MessageAttributes: {
        maxPrice: {
          DataType: "Number",
          StringValue: prices.toString(),
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
