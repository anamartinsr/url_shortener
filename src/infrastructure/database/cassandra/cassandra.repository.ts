import { IUrlRepository } from '../../../domain/repositories/url.repository.interface';
import { UrlEntity } from '../../../domain/entities/url.entity';
import { cassandraClient } from './cassandra.config';

const INSERT_URL = 'INSERT INTO url (shortcode, long_url, created_at) VALUES (?, ?, ?)';
const SELECT_BY_SHORTCODE = 'SELECT shortcode, long_url, created_at FROM url WHERE shortcode = ?';

export class CassandraUrlRepository implements IUrlRepository {
  async save(url: UrlEntity): Promise<void> {
    await cassandraClient.execute(INSERT_URL, [url.shortcode, url.long_url, url.created_at], { prepare: true });
  }

  async findByShortcode(shortcode: string): Promise<UrlEntity | null> {
    const res = await cassandraClient.execute(SELECT_BY_SHORTCODE, [shortcode], { prepare: true });
    if (res.rowLength === 0) return null;
    const row = res.first();
    return {
      shortcode: row['shortcode'],
      long_url: row['long_url'],
      created_at: row['created_at']
    };
  }
}
