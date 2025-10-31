import request from 'supertest';
import app from '../../src/infrastructure/http/server';

describe('URL Controller (integration)', () => {
  it('POST /api/shorten deve encurtar uma URL', async () => {
    const res = await request(app)
      .post('/api/shorten')
      .send({ url: 'https://example.com' });

    expect(res.statusCode).toBe(201);
    expect(res.body.shortcode).toBeDefined();
  });

  it('GET /:shortcode deve redirecionar para a URL original', async () => {
    const shortcode = 'abc123';
    const res = await request(app).get(`/${shortcode}`);

    expect([301, 302]).toContain(res.statusCode);
  });
});
