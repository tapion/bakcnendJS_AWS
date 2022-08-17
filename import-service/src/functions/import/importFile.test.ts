import { importFile } from "./handler";
import { mockClient } from "aws-sdk-client-mock";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const testUrl = "https://signedUrl.com";

jest.mock("@aws-sdk/s3-request-presigner", () => {
  return {
    getSignedUrl: jest.fn(() => testUrl),
  };
});

describe("getSignedUrl test", () => {
  const event = {
    httpMethod: "Get",
    queryStringParameters: {
      name: "tapion",
    },
  };

  const s3ClientMock = mockClient(S3Client);

  beforeEach(() => {
    s3ClientMock.reset();
  });

  test("Should get the signed url from s3", async () => {
    s3ClientMock.on(PutObjectCommand).resolves({});
    const { body } = await importFile(event);
    expect(body).toBe(JSON.stringify(testUrl));
  });
});
