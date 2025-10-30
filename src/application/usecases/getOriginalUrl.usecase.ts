import { IUrlRepository } from '../../domain/repositories/url.repository.interface';
import { redisCache } from '../../infrastructure/database/redis/redis.cache';

export class GetOriginalUrlUseCase {
  constructor(private urlRepo: IUrlRepository) {}

  async execute(shortcode: string): Promise<string | null> {
    const cacheKey = `short:${shortcode}`;
    const cached = await redisCache.get(cacheKey);
    if (cached) return cached;

    const record = await this.urlRepo.findByShortcode(shortcode);
    if (!record) return null;

    await redisCache.set(cacheKey, record.long_url);
    return record.long_url;
  }
}
