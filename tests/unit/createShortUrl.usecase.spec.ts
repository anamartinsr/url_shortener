import { CreateShortUrlUseCase } from '../../src/application/usecases/createShortUrl.usecase';
import { IUrlRepository } from '../../src/domain/repositories/url.repository.interface';
import { redisCache } from '../../src/infrastructure/database/redis/redis.cache';
import { UrlEntity } from '../../src/domain/entities/url.entity';
import { HashidService } from '../../src/application/services/hashid.service';

describe('CreateShortUrlUseCase', () => {
  let useCase: CreateShortUrlUseCase;
  let mockRepo: jest.Mocked<Partial<IUrlRepository>> & { existsLongUrl?: jest.Mock };
  let mockHashid: jest.Mocked<HashidService>;

  let spyIncr: jest.SpyInstance;
  let spySet: jest.SpyInstance;

  beforeEach(() => {
    mockRepo = {
      save: jest.fn().mockResolvedValue(undefined),
      findByShortcode: jest.fn().mockResolvedValue(null),
      existsLongUrl: jest.fn().mockResolvedValue(null)
    } as unknown as typeof mockRepo;

    mockHashid = {
      encode: jest.fn().mockReturnValue('abc123'),
      decode: jest.fn()
    } as unknown as jest.Mocked<HashidService>;

    spyIncr = jest.spyOn(redisCache, 'incr').mockResolvedValue(1 as any);
    spySet = jest.spyOn(redisCache, 'set').mockResolvedValue(undefined as any);

    useCase = new CreateShortUrlUseCase(mockRepo as unknown as IUrlRepository, mockHashid as unknown as HashidService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('deve criar uma nova URL encurtada com sucesso', async () => {
    const longUrl = 'https://example.com/teste';

    const fakeEntity: UrlEntity = {
      shortcode: 'abc123',
      long_url: longUrl,
      created_at: new Date(),
    };

    (mockRepo.save as jest.Mock).mockResolvedValue(fakeEntity);

    const result = await useCase.execute({ long_url: longUrl });

    expect(result).toBeDefined();
    expect(result.shortcode).toBe('abc123');

    expect(mockRepo.save).toHaveBeenCalledWith(expect.objectContaining({
      long_url: longUrl,
      shortcode: 'abc123'
    }));

    expect(spyIncr).toHaveBeenCalled();
    expect(spySet).toHaveBeenCalledWith(`short:abc123`, longUrl, expect.any(Number));
  });
});
