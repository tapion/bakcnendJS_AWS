import { formatJSONResponse, errorResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import {
  S3Client,
  GetObjectCommand,
  CopyObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
const csv = require("csv-parser");

import { S3Event } from "aws-lambda";

const bucketName = "products-shop";

const importFileParser = async (event: S3Event) => {
  console.log("event", event.Records[0].s3.object.key);
  try {
    const s3 = new S3Client({ region: "us-east-1" });
    const params = {
      Bucket: bucketName,
      Key: event.Records[0].s3.object.key,
    };
    const getCommand = new GetObjectCommand(params);
    let response = await s3.send(getCommand);
    await response.Body.pipe(csv()).on("data", (data: any) =>
      console.log(data)
    );

    await moveObject(s3, event.Records[0].s3.object.key, bucketName);

    return formatJSONResponse("ok");
  } catch (e) {
    console.log("error **", e);
    return errorResponse(e.message, 500);
  }
};

const moveObject = async (
  s3: S3Client,
  objName: string,
  bucketName: string
) => {
  const copy = new CopyObjectCommand({
    Bucket: bucketName,
    CopySource: `${bucketName}/${objName}`,
    Key: objName.replace("uploaded", "parsed"),
  });

  await s3.send(copy);

  const deleteObj = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: objName,
  });

  await s3.send(deleteObj);
};

export const main = middyfy(importFileParser);
