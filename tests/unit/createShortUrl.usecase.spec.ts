jest.mock('../../src/infrastructure/database/redis/redis.config', () => ({
  redisClient: {
    connect: jest.fn(),
    quit: jest.fn(),
    get: jest.fn(),
    set: jest.fn(),
    incr: jest.fn(),
  },
}));

jest.mock('../../src/infrastructure/database/redis/redis.cache', () => ({
  redisCache: {
    get: jest.fn(),
    set: jest.fn(),
    incr: jest.fn(),
  },
}));

import { CreateShortUrlUseCase } from '../../src/application/usecases/createShortUrl.usecase';
import { IUrlRepository } from '../../src/domain/repositories/url.repository.interface';
import { redisCache } from '../../src/infrastructure/database/redis/redis.cache';
import { UrlEntity } from '../../src/domain/entities/url.entity';
import { HashidService } from '../../src/application/services/hashid.service';

describe('CreateShortUrlUseCase', () => {
  let useCase: CreateShortUrlUseCase;
  let mockRepo: jest.Mocked<Partial<IUrlRepository>>;
  let mockHashid: jest.Mocked<HashidService>;

  beforeEach(() => {
    mockRepo = {
      save: jest.fn(),
      findByShortcode: jest.fn(),
    };

    mockHashid = {
      encode: jest.fn().mockReturnValue('abc123'),
      decode: jest.fn(),
    } as unknown as jest.Mocked<HashidService>;

    (redisCache.incr as jest.Mock).mockResolvedValue(1);
    (redisCache.set as jest.Mock).mockResolvedValue(undefined);

    useCase = new CreateShortUrlUseCase(
      mockRepo as unknown as IUrlRepository,
      mockHashid as unknown as HashidService
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
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

    expect(mockRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({
        long_url: longUrl,
        shortcode: 'abc123',
      })
    );

    expect(redisCache.incr).toHaveBeenCalled();
   expect(redisCache.set).toHaveBeenCalledWith(`short:abc123`, longUrl);

  });
});
