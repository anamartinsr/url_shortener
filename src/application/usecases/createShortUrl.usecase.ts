import Joi from 'joi';
import { IUrlRepository } from '../../domain/repositories/url.repository.interface';
import { HashidService } from '../services/hashid.service';
import { redisCache } from '../../infrastructure/database/redis/redis.cache';
import { env } from '../../infrastructure/config/env';
import { UrlEntity } from '../../domain/entities/url.entity';

export class CreateShortUrlUseCase {
  constructor(
    private urlRepo: IUrlRepository,
    private hashidService: HashidService
  ) {}

  private schema = Joi.object({
    long_url: Joi.string().uri().required()
  });

  async execute(payload: { long_url: string }): Promise<{ shortcode: string }> {
    const { error } = this.schema.validate(payload);
    if (error) throw new Error('Invalid URL');

    const id = await redisCache.incr(env.counterKey);

    const shortcode = this.hashidService.encode(id);

    const entity: UrlEntity = {
      shortcode,
      long_url: payload.long_url,
      created_at: new Date()
    };

    await this.urlRepo.save(entity);

    await redisCache.set(`short:${shortcode}`, payload.long_url);

    return { shortcode };
  }
}
