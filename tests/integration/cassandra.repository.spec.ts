import { CassandraUrlRepository } from '../../src/infrastructure/database/cassandra/cassandra.repository';
import { UrlEntity } from '../../src/domain/entities/url.entity';

describe('CassandraUrlRepository (integration)', () => {
  let repository: CassandraUrlRepository;

  beforeAll(async () => {
    repository = new CassandraUrlRepository();
  });

  it('deve salvar e buscar uma URL corretamente', async () => {
    const shortcode = 'abc123';
    const long_url = 'https://example.com/integration';

    const urlEntity: UrlEntity = {
      shortcode,
      long_url,
      created_at: new Date(),
    };

    await repository.save(urlEntity);

    const result = await repository.findByShortcode(shortcode);

    expect(result).not.toBeNull();
    expect(result?.shortcode).toBe(shortcode);
    expect(result?.long_url).toBe(long_url);
    expect(result?.created_at).toBeInstanceOf(Date);
  });
});
