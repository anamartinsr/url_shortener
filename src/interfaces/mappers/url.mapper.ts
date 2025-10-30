import { UrlEntity } from '../../domain/entities/url.entity';

export class UrlMapper {
  static toDTO(entity: UrlEntity) {
    return {
      shortcode: entity.shortcode,
      long_url: entity.long_url,
      created_at: entity.created_at.toISOString()
    };
  }

  static toEntity(data: any): UrlEntity {
    return {
      shortcode: data.shortcode,
      long_url: data.long_url,
      created_at: new Date(data.created_at)
    };
  }
}
