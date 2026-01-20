jest.mock('../../src/infrastructure/database/redis/redis.config', () => ({
  redisClient: {
    connect: jest.fn(),
    quit: jest.fn(),
    get: jest.fn(),
    set: jest.fn(),
    incr: jest.fn(),
    del: jest.fn(),
  },
}));

jest.mock('../../src/infrastructure/database/redis/redis.cache', () => ({
  redisCache: {
    get: jest.fn(),
    set: jest.fn(),
    incr: jest.fn(),
    del: jest.fn(),
  },
}));

import { GetOriginalUrlUseCase } from '../../src/application/usecases/getOriginalUrl.usecase';
import { IUrlRepository } from '../../src/domain/repositories/url.repository.interface';
import { UrlEntity } from '../../src/domain/entities/url.entity';
import { redisCache } from '../../src/infrastructure/database/redis/redis.cache';


describe('GetOriginalUrlUseCase', () => {
  let useCase: GetOriginalUrlUseCase;
  let mockRepo: jest.Mocked<IUrlRepository>;

  beforeEach(() => {
    mockRepo = {
      findByShortcode: jest.fn(),
      save: jest.fn(),
    } as unknown as jest.Mocked<IUrlRepository>;

    useCase = new GetOriginalUrlUseCase(mockRepo);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('deve retornar a URL original do cache', async () => {
    const spyGet = jest.spyOn(redisCache, 'get').mockResolvedValue('https://example.com/from-cache');
    const spySet = jest.spyOn(redisCache, 'set').mockResolvedValue();

    const result = await useCase.execute({ shortcode: 'abc123' });

    expect(result).toBe('https://example.com/from-cache');
    expect(spyGet).toHaveBeenCalledWith('short:abc123');
    expect(mockRepo.findByShortcode).not.toHaveBeenCalled();
    expect(spySet).not.toHaveBeenCalled();
  });

  it('deve buscar a URL no banco e salvar no cache se não estiver no cache', async () => {
    jest.spyOn(redisCache, 'get').mockResolvedValue(null);
    const spySet = jest.spyOn(redisCache, 'set').mockResolvedValue();

    const fakeEntity: UrlEntity = {
      shortcode: 'abc123',
      long_url: 'https://example.com/db',
      created_at: new Date(),
    };

    mockRepo.findByShortcode.mockResolvedValue(fakeEntity);

    const result = await useCase.execute({ shortcode: 'abc123' });

    expect(result).toBe('https://example.com/db');
    expect(mockRepo.findByShortcode).toHaveBeenCalledWith('abc123');
    expect(spySet).toHaveBeenCalledWith('short:abc123', 'https://example.com/db');
  });

  it('deve retornar null se o shortcode não existir no banco', async () => {
    jest.spyOn(redisCache, 'get').mockResolvedValue(null);
    mockRepo.findByShortcode.mockResolvedValue(null);

    const result = await useCase.execute({ shortcode: 'naoExiste123' });

    expect(result).toBeNull();
  });
});
