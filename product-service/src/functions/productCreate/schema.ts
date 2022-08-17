export default {
  type: "object",
  properties: {
    title: { type: 'string', description: 'Product name' },
    description: { type: 'string', description: 'Product description' },
    price: { type: 'number', description: 'Price of the product' },
    count: { type: 'number', description: 'Price of the product' },
  },
  required: ['title','description','price']
} as const;
