import { Client } from "pg";
import { Product } from "src/types/product";

const db = new Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DB,
  password: process.env.PG_PASS,
  port: parseInt(process.env.PG_PORT),
});
db.connect();

export { db };

export const createProduct = async (product: Product) => {
  await db.query("BEGIN");
  let query =
    "insert into products(title, description, price) values($1, $2, $3) RETURNING id";
  const newProduct = await db.query(query, [
    product.title,
    product.description,
    product.price,
  ]);
  query = "insert into stocks (product_id, count) values ($1,$2)";
  await db.query(query, [newProduct.rows[0].id, product.count]);
  await db.query("COMMIT");
};
