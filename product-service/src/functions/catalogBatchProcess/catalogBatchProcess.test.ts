const querySpy: jest.Mock = jest.fn(() => undefined);

import { catalogBatchProcess } from "./handler";
import { mockClient } from "aws-sdk-client-mock";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";


jest.mock("../../providers/database", () => {
  return {
    createProduct: querySpy,
  };
});

describe("Send SNS test", () => {
  const event = {
    Records: [
      {
        messageId: "5230d308-b663-4fba-a4dd-66f0b9ea162c",
        body: "{\"title\":\"Soe\",\"description\":\"A terrible doggy 1\",\"price\":\" 999\",\"count\":\" 1\"}",
        messageAttributes: {},
        md5OfBody: "c196b67c5da8f1c9ce9187aecca51462",
        eventSource: "aws:sqs",
        eventSourceARN: "arn:aws:sqs:us-east-1:761488678750:MyQueue",
        awsRegion: "us-east-1",
        receiptHandle: '',
        attributes: {
            ApproximateReceiveCount: '',
            SentTimestamp: '',
            SenderId: '',
            ApproximateFirstReceiveTimestamp: '',
        },
      }
    ]
  };

  

  beforeEach(() => {
    sns.reset();
  });

  const sns = mockClient(SNSClient);

  test("Should call the database", async () => {
      sns.on(PublishCommand).resolves({});
      await catalogBatchProcess(event);
      expect(querySpy).toHaveBeenCalledTimes(1);
  });

  test("Should publish the sns", async () => {
      sns.on(PublishCommand).resolves({});
      await catalogBatchProcess(event);
      expect(sns).toHaveReceivedCommand(PublishCommand);
  });
});
