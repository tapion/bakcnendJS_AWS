import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "get",
        path: "/products/{productId}",
        responses: {
          200: {
            description: "It will return the product with the ID requested",
            bodyType: "Product",
          },
        },
      },
    },
  ],
};
