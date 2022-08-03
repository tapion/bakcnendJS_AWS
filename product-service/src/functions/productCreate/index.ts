import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "POST",
        path: "/products",
        responses: {
          200: {
            description: "Create a new product",
            bodyType: "Product",
          },
          400: {
            description: "Invalid product structure",
          }
        },
      },
    },
  ],
};
