jest.mock('../../src/application/usecases/createShortUrl.usecase');
jest.mock('../../src/application/usecases/getOriginalUrl.usecase');

import request from 'supertest';
import { app } from '../../src/infrastructure/http/app';
import { CreateShortUrlUseCase } from '../../src/application/usecases/createShortUrl.usecase';
import { GetOriginalUrlUseCase } from '../../src/application/usecases/getOriginalUrl.usecase';

const createMock = CreateShortUrlUseCase as jest.MockedClass<typeof CreateShortUrlUseCase>;
const getMock = GetOriginalUrlUseCase as jest.MockedClass<typeof GetOriginalUrlUseCase>;

describe('URL Controller', () => {
  beforeEach(() => {
    createMock.prototype.execute.mockResolvedValue({
      shortcode: 'abc123',
      long_url: 'https://example.com',
      created_at: new Date(),
    });

    getMock.prototype.execute.mockResolvedValue('https://example.com');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('POST /api/shorten deve retornar shortcode', async () => {
    const res = await request(app)
      .post('/api/shorten')
      .send({ long_url: 'https://example.com' });

    expect(res.status).toBe(201);
    expect(res.body.shortcode).toBe('abc123');
  });

  it('GET /:shortcode deve redirecionar', async () => {
    const res = await request(app).get('/abc123').redirects(0);

    expect([301, 302]).toContain(res.status);
    expect(res.headers.location).toBe('https://example.com');
  });
});
