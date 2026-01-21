import { GetUrlDTO } from "../../interfaces/dto/get-url.dto";
import {
  IUrlRepository,
  IUrlCacheRepository,
} from "../../domain/repositories/url.repository.interface";
import { logger } from "../../infrastructure/logger/logger";
export class GetOriginalUrlUseCase {
  constructor(
    private urlRepo: IUrlRepository,
    private cacheRepo: IUrlCacheRepository,
  ) {}

  async execute(dto: GetUrlDTO): Promise<string | null> {
    const { shortcode } = dto;
    const cacheKey = `short:${shortcode}`;
    const cached = await this.cacheRepo.get(cacheKey);

    if (cached && cached !== "__NULL__") {
      logger.debug({ shortcode }, "Cache hit");
      return cached;
    }

    if (cached === "__NULL__") {
      logger.debug({ shortcode }, "Cache negative hit");
      return null;
    }

    logger.debug({ shortcode }, "Cache miss, querying database");

    const record = await this.urlRepo.findByShortcode(shortcode);

    if (!record) {
      await this.cacheRepo.save(cacheKey, "__NULL__", 60);
      return null;
    }

    await this.cacheRepo.save(cacheKey, record.long_url);
    return record.long_url;
  }
}
