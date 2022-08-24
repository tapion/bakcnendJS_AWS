// import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
// import { formatJSONResponse } from "@libs/api-gateway";
import {
  APIGatewayAuthorizerResult,
  APIGatewayTokenAuthorizerEvent,
} from "aws-lambda";
// import { middyfy } from '@libs/lambda';

// import schema from './schema';
enum Effect {
  Allow = "Allow",
  Deny = "Deny",
}

export const authorizer = async (
  event: APIGatewayTokenAuthorizerEvent
): Promise<APIGatewayAuthorizerResult> => {
  console.log("Event", event);
  const principalId = "tapion";

  const { authorizationToken, methodArn } = event;
  const [basic, token] = authorizationToken.split(" ");
  console.log("authorizationToken", authorizationToken);
  console.log("basic", basic);
  console.log("token", token);
  console.log("methodArn", methodArn);
  if (!!!authorizationToken || !basic || basic !== "Basic" || !token) {
    return generateResponse(principalId, Effect.Deny, methodArn);
  }
  if (token === process.env.TAPION) {
    return generateResponse(principalId, Effect.Allow, methodArn);
  }
  return generateResponse(principalId, Effect.Deny, methodArn);
};

const generateResponse = (
  principalId: string,
  effect: Effect,
  resource: string
): APIGatewayAuthorizerResult => {
  return {
    principalId,
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: effect,
          Resource: resource,
        },
      ],
    },
  };
};

// export const main = middyfy(hello);
