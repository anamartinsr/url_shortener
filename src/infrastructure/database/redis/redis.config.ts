import Redis from 'ioredis';
import { env } from '../../config/env';

export const redisClient =
  process.env.NODE_ENV === 'test'
    ? null
    : new Redis(env.redisUrl);
