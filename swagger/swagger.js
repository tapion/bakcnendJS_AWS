// this file was generated by serverless-auto-swagger
            module.exports = {
  "swagger": "2.0",
  "info": {
    "title": "backend",
    "version": "1"
  },
  "paths": {
    "/products": {
      "get": {
        "summary": "products",
        "description": "",
        "operationId": "products.get.products",
        "consumes": [
          "application/json"
        ],
        "produces": [
          "application/json"
        ],
        "parameters": [],
        "responses": {
          "200": {
            "description": "This return all the products in the stock",
            "schema": {
              "$ref": "#/definitions/Products"
            }
          }
        }
      }
    },
    "/products/{productId}": {
      "get": {
        "summary": "productById",
        "description": "",
        "operationId": "productById.get./products/{productId}",
        "consumes": [
          "application/json"
        ],
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "productId",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responses": {
          "200": {
            "description": "It will return the product with the ID requested",
            "schema": {
              "$ref": "#/definitions/Product"
            }
          }
        }
      }
    }
  },
  "definitions": {
    "Product": {
      "properties": {
        "count": {
          "title": "Product.count",
          "type": "number"
        },
        "description": {
          "title": "Product.description",
          "type": "string"
        },
        "id": {
          "title": "Product.id",
          "type": "string"
        },
        "price": {
          "title": "Product.price",
          "type": "number"
        },
        "title": {
          "title": "Product.title",
          "type": "string"
        }
      },
      "required": [
        "count",
        "description",
        "id",
        "price",
        "title"
      ],
      "additionalProperties": false,
      "title": "Product",
      "type": "object"
    },
    "Products": {
      "items": {
        "$ref": "#/definitions/Product",
        "title": "Products.[]"
      },
      "title": "Products.[]",
      "type": "array"
    }
  },
  "securityDefinitions": {}
};