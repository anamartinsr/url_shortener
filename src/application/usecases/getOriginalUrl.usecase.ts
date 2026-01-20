import { GetUrlDTO } from "../../interfaces/dto/get-url.dto";
import {
  IUrlRepository,
  IUrlCacheRepository,
} from "../../domain/repositories/url.repository.interface";
export class GetOriginalUrlUseCase {
  constructor(
    private urlRepo: IUrlRepository,
    private cacheRepo: IUrlCacheRepository
  ) {}

  async execute(dto: GetUrlDTO): Promise<string | null> {
    const { shortcode } = dto;
    const cacheKey = `short:${shortcode}`;
    const cached = await this.cacheRepo.get(cacheKey);
    if (cached) return cached;

    const record = await this.urlRepo.findByShortcode(shortcode);
    if (!record) return null;

    await this.cacheRepo.save(cacheKey, record.long_url);
    return record.long_url;
  }
}
