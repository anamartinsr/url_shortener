import { UrlEntity } from '../entities/url.entity';

export interface IUrlRepository {
  save(url: UrlEntity): Promise<void>;
  findByShortcode(shortcode: string): Promise<UrlEntity | null>;
}
