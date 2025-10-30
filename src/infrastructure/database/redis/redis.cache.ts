import { redisClient } from './redis.config';
import { env } from '../../config/env';

export const redisCache = {
  async get(key: string): Promise<string | null> {
    return redisClient.get(key);
  },

  async set(key: string, value: string, ttlSeconds = env.cacheTTL): Promise<void> {
    await redisClient.set(key, value, 'EX', ttlSeconds);
  },

  async incr(key: string): Promise<number> {
    return redisClient.incr(key);
  }
};
