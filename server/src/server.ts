import express, { Express, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db";

const PORT: number = Number(process.env.SERVER_PORT ?? 8000);

const app: Express = express();

dotenv.config({ path: "../.env" });
app.use(cors());
app.use(express.json());

async function main() {
  const client = await pool.connect();
  try {
    // TODO: add any query to user data table
    // const response = await client.query("SELECT * FROM user_data LIMIT 1;");
  } catch (error) {
    console.log(error);
  } finally {
    client.release();
  }
}

main()
  .then(() => console.log("Connected to Postgres!"))
  .catch((err) => console.log("Error connecting to Postgres", err));

app.listen(PORT, process.env.SERVER_HOST ?? "server-c", () => {
  console.log(`Server running on port ${PORT}`);
});
