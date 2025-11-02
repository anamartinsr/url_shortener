jest.mock("../../src/infrastructure/database/redis/redis.config", () => ({
  redisClient: {
    connect: jest.fn(),
    quit: jest.fn(),
    get: jest.fn(),
    set: jest.fn(),
    incr: jest.fn(),
    del: jest.fn(),
  },
}));

jest.mock("../../src/infrastructure/database/redis/redis.cache", () => ({
  redisCache: {
    get: jest.fn(),
    set: jest.fn(),
    incr: jest.fn(),
    del: jest.fn(),
  },
}));

jest.mock(
  "../../src/infrastructure/database/cassandra/cassandra.config",
  () => ({
    cassandraClient: {
      connect: jest.fn(),
      shutdown: jest.fn(),
      execute: jest.fn(),
    },
  })
);

import request from "supertest";
import { app } from "../../src/infrastructure/http/app";
import { redisClient } from "../../src/infrastructure/database/redis/redis.config";
import { redisCache } from "../../src/infrastructure/database/redis/redis.cache";
import { cassandraClient } from "../../src/infrastructure/database/cassandra/cassandra.config";

const redisClientMock = redisClient as unknown as jest.Mocked<
  typeof redisClient
>;
const redisCacheMock = redisCache as unknown as jest.Mocked<typeof redisCache>;
const cassandraMock = cassandraClient as unknown as jest.Mocked<
  typeof cassandraClient
>;

const mockDb: Record<string, { long_url: string; created_at: string }> = {};

beforeAll(() => {
  redisClientMock.connect.mockResolvedValue();
  redisClientMock.quit.mockResolvedValue("OK");
  redisClientMock.get.mockResolvedValue(null);
  redisClientMock.set.mockResolvedValue("OK");
  redisClientMock.incr.mockResolvedValue(1);

  redisCacheMock.get.mockResolvedValue(null);
  redisCacheMock.set.mockResolvedValue();

  redisCacheMock.get.mockImplementation(async (key: string) => {
    const shortcode = key.replace("short:", "");
    return mockDb[shortcode]?.long_url || null;
  });

  redisCacheMock.set.mockImplementation(async (key: string, value: string) => {
    const shortcode = key.replace("short:", "");
    if (!mockDb[shortcode]) {
      mockDb[shortcode] = { long_url: value, created_at: new Date().toISOString() };
    }
  });

  redisCacheMock.incr.mockResolvedValue(1);


  cassandraMock.connect.mockImplementation(async () => {});
  cassandraMock.shutdown.mockImplementation(async () => {});

  cassandraMock.execute.mockImplementation(async (...args: any[]) => {
    const query = args[0] as string;
    const params = args[1] as any[] | undefined;

    const q = query.toLowerCase();

    if (q.includes("insert") && params) {
      const [shortcode, long_url, created_at] = params;
      mockDb[shortcode] = { long_url, created_at };
      return { rows: [], rowLength: 0, first: () => null } as any;
    }

    if (q.includes("select") && params) {
      const shortcode = params[0];
      const row = mockDb[shortcode];
      return {
        rows: row ? [{ shortcode, ...row }] : [],
        rowLength: row ? 1 : 0,
        first: () => (row ? { shortcode, ...row } : null),
      } as any;
    }

    return { rows: [], rowLength: 0, first: () => null } as any;
  });
});

afterAll(async () => {
  await redisClientMock.quit();
  await cassandraMock.shutdown();
});

describe("URL Controller (integration)", () => {
  it("POST /api/shorten deve encurtar uma URL", async () => {
    const res = await request(app)
      .post("/api/shorten")
      .send({ long_url: "https://example.com" })
      .expect(201);

    expect(res.body.shortcode).toBeDefined();
    expect(res.body.short_url).toContain(res.body.shortcode);
  });

    it("GET /:shortcode deve redirecionar para a URL original", async () => {
    const createRes = await request(app)
      .post("/api/shorten")
      .send({ long_url: "https://example.com" })
      .expect(201);

    const { shortcode } = createRes.body;

    const res2 = await request(app).get(`/${shortcode}`).redirects(0);

    expect([301, 302]).toContain(res2.statusCode);
    expect(res2.headers.location).toBe("https://example.com");
  });
});
