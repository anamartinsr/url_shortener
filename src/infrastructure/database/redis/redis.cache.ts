import { redisClient } from './redis.config';
import { env } from '../../config/env';
import { IUrlCacheRepository } from '../../../domain/repositories/url.repository.interface';
export class RedisUrlCacheRepository implements IUrlCacheRepository {
  async get(key: string): Promise<string | null> {
    return redisClient.get(key);
  }

  async save(key: string, value: string): Promise<void> {
    await redisClient.set(key, value, 'EX', env.cacheTTL);
  }

  async incrementCounter(): Promise<number> {
    return redisClient.incr(env.counterKey);
  }
}

