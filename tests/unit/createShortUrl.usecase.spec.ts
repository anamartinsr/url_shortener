import { CreateShortUrlUseCase } from '../../src/application/usecases/createShortUrl.usecase';
import { IUrlRepository, IUrlCacheRepository } from '../../src/domain/repositories/url.repository.interface';
import { HashidService } from '../../src/application/services/hashid.service';

describe('CreateShortUrlUseCase', () => {
  let useCase: CreateShortUrlUseCase;

  const urlRepo: jest.Mocked<IUrlRepository> = {
    save: jest.fn(),
    findByShortcode: jest.fn(),
  };

  const cacheRepo: jest.Mocked<IUrlCacheRepository> = {
    incrementCounter: jest.fn(),
    save: jest.fn(),
    get: jest.fn(),
  };

  const hashService: jest.Mocked<HashidService> = {
    encode: jest.fn(),
    decode: jest.fn(),
  } as any;

  beforeEach(() => {
    cacheRepo.incrementCounter.mockResolvedValue(1);
    hashService.encode.mockReturnValue('abc123');

    useCase = new CreateShortUrlUseCase(
      urlRepo,
      hashService,
      cacheRepo
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve criar uma URL encurtada com sucesso', async () => {
    const result = await useCase.execute({
      long_url: 'https://example.com',
    });

    expect(result.shortcode).toBe('abc123');
    expect(urlRepo.save).toHaveBeenCalledTimes(1);
    expect(cacheRepo.save).toHaveBeenCalledWith(
      'short:abc123',
      'https://example.com'
    );
  });
});
