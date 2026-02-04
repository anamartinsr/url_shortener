import { GetOriginalUrlUseCase } from '../../src/application/usecases/getOriginalUrl.usecase';
import { IUrlRepository, IUrlCacheRepository } from '../../src/domain/repositories/url.repository.interface';

describe('GetOriginalUrlUseCase', () => {
  const urlRepo: jest.Mocked<IUrlRepository> = {
    findByShortcode: jest.fn(),
    save: jest.fn(),
  };

  const cacheRepo: jest.Mocked<IUrlCacheRepository> = {
    get: jest.fn(),
    save: jest.fn(),
    incrementCounter: jest.fn(),
  };

  const useCase = new GetOriginalUrlUseCase(
    urlRepo,
    cacheRepo
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar a URL diretamente do cache', async () => {
    cacheRepo.get.mockResolvedValue('https://cached.com');

    const result = await useCase.execute({ shortcode: 'abc' });

    expect(result).toBe('https://cached.com');
    expect(urlRepo.findByShortcode).not.toHaveBeenCalled();
  });

  it('deve buscar no banco e salvar no cache em cache miss', async () => {
    cacheRepo.get.mockResolvedValue(null);
    urlRepo.findByShortcode.mockResolvedValue({
      shortcode: 'abc',
      long_url: 'https://db.com',
      created_at: new Date(),
    });

    const result = await useCase.execute({ shortcode: 'abc' });

    expect(result).toBe('https://db.com');
    expect(cacheRepo.save).toHaveBeenCalledWith(
      'short:abc',
      'https://db.com'
    );
  });

  it('deve retornar null quando não encontrar a URL', async () => {
    cacheRepo.get.mockResolvedValue(null);
    urlRepo.findByShortcode.mockResolvedValue(null);

    const result = await useCase.execute({ shortcode: 'naoExiste' });

    expect(result).toBeNull();
    expect(cacheRepo.save).toHaveBeenCalledWith(
      'short:naoExiste',
      '__NULL__',
      60
    );
  });
});
