import express, { Express, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db";
import APIRoutes from "./routes/index";
import redis from "./cache";

const PORT: number = Number(process.env.SERVER_PORT ?? 8000);

const app: Express = express();

dotenv.config({ path: "../.env" });
app.use(cors());
app.use(express.json());
app.use("/api", APIRoutes);

async function mainPG() {
  let client;
  try {
    client = await pool.connect();
  } catch (error) {
    throw new Error(error);
  } finally {
    client?.release();
  }
}

async function mainRedis() {
  try {
    const client = await redis.connect();
  } catch (error) {
    throw new Error(error);
  }
}

mainPG()
  .then(() => console.log("Connected to Postgres!"))
  .catch((err) => console.log("Error connecting to Postgres:\n", err));

mainRedis()
  .then(() => console.log("Connected to Redis!"))
  .catch((err) => console.log("Error connecting to Redis:\n", err));

app.listen(PORT, process.env.SERVER_HOST ?? "server-c", () => {
  console.log(`Server running on port ${PORT}`);
});
