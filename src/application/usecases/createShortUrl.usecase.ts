import { CreateUrlDTO } from "../../interfaces/dto/create-url.dto";
import { IUrlRepository, IUrlCacheRepository } from '../../domain/repositories/url.repository.interface';
import { UrlEntity } from '../../domain/entities/url.entity';
import { HashidService } from '../services/hashid.service';
export class CreateShortUrlUseCase {
  constructor(
    private urlRepo: IUrlRepository,
    private hashidService: HashidService,
    private cacheRepo: IUrlCacheRepository,
  ) {}

  async execute(dto: CreateUrlDTO): Promise<UrlEntity> {
    const id = await this.cacheRepo.incrementCounter();
    const shortcode = this.hashidService.encode(id);

    const entity : UrlEntity = {
      shortcode,
      long_url: dto.long_url,
      created_at: new Date(),
    };

    await this.urlRepo.save(entity);
    await this.cacheRepo.save(`short:${shortcode}`, entity.long_url);
    return entity;
  }
}
