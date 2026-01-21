import { redisClient } from "./redis.config";
import { env } from "../../config/env";
import { IUrlCacheRepository } from "../../../domain/repositories/url.repository.interface";
import { logger } from "../../logger/logger";
export class RedisUrlCacheRepository implements IUrlCacheRepository {
  async get(key: string): Promise<string | null> {
    try {
      return redisClient.get(key);
    } catch (err) {
      logger.error({ err, key }, "Redis GET failed");
      throw err;
    }
  }

  async save(key: string, value: string, ttlSeconds?: number): Promise<void> {
    try {
      const ttl = ttlSeconds ?? env.cacheTTL;
      await redisClient.set(key, value, "EX", ttl);
    } catch (err) {
      logger.error({ err, key }, "Redis SET failed");
      throw err;
    }
  }

  async incrementCounter(): Promise<number> {
    try {
      return redisClient.incr(env.counterKey);
    } catch (err) {
      logger.error({ err, key: env.counterKey }, "Redis INCR failed");
      throw err;
    }
  }
}
