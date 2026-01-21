import { UrlEntity } from "../entities/url.entity";

export interface IUrlRepository {
  save(url: UrlEntity): Promise<void>;
  findByShortcode(shortcode: string): Promise<UrlEntity | null>;
}
export interface IUrlCacheRepository {
  save(key: string, value: string, ttlSeconds?: number): Promise<void>;
  get(key: string): Promise<string | null>;
  incrementCounter(): Promise<number>;
}
