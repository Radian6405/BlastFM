import { createClient } from "redis";

const redisPort = process.env.REDIS_PORT ?? 6000;
const redisHost = process.env.REDIS_HOST;
const redisUser = process.env.REDIS_USERNAME;
const redisPassword = process.env.REDIS_PASSWORD;

const redis = createClient({
  url: `redis://${redisUser}:${redisPassword}@${redisHost}:${redisPort}`,
});

export default redis;

// {
//   url: "redis://" + "127.0.0.1" + ":" + String(redisPort),
//   username: process.env.REDIS_USER,
//   password: process.env.REDIS_PASSWORD,
// }
