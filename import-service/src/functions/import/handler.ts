import { formatJSONResponse, errorResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const importFile = async (event) => {
  console.log('event', event);
  try{
    const s3 = new S3Client({region: 'us-east-1'});
  const { name: fileName } = event.queryStringParameters;
  console.log('fileName', fileName);
  const params = {
    Bucket: 'products-shop',
    Key: `uploaded/${fileName}`,
    ContentType: 'text/csv'

  };
  const putObjCommand = new PutObjectCommand(params);
  const url = await getSignedUrl(s3,putObjCommand, {expiresIn: 60});
  return formatJSONResponse(url);
  }catch(e){
    console.log('error **', e);
    return errorResponse(e.message, 500);
  }
  
};

export const main = middyfy(importFile);
