import { app, redisClient, cassandraClient } from "./app";
import { env } from "../config/env";
import { logger } from "../logger/logger";

export async function startServer() {
  try {
    await cassandraClient.connect();
    logger.info("Cassandra connected");
  } catch (err) {
    logger.fatal({ err }, "Cassandra connection failed");
    process.exit(1);
  }

  redisClient.on("error", (err) => logger.error({ err }, "Redis error"));
  redisClient.on("connect", () => logger.info("Redis connected"));

  app.listen(env.port, () => {
    logger.info("Starting application");
  });
}

startServer();
