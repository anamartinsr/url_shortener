jest.mock(
  "../../src/infrastructure/database/cassandra/cassandra.config",
  () => ({
    cassandraClient: {
      execute: jest.fn(),
    },
  }),
);

import { CassandraUrlRepository } from "../../src/infrastructure/database/cassandra/cassandra.repository";
import { cassandraClient } from "../../src/infrastructure/database/cassandra/cassandra.config";
import { UrlEntity } from "../../src/domain/entities/url.entity";

const mockDb: Record<string, UrlEntity> = {};
const cassandraMock = cassandraClient as jest.Mocked<typeof cassandraClient>;

describe("CassandraUrlRepository", () => {
  let repository: CassandraUrlRepository;

  beforeEach(() => {
    cassandraMock.execute.mockImplementation(async (query, params) => {
      const q = query.toLowerCase();

      if (q.includes("insert")) {
        const values = params as unknown as any[];

        const [shortcode, long_url, created_at] = values;

        mockDb[shortcode] = { shortcode, long_url, created_at };
        return {} as any;
      }

      if (q.includes("select")) {
        const values = params as unknown as any[];
        const shortcode = values[0];
        const row = mockDb[shortcode];
        return {
          rowLength: row ? 1 : 0,
          first: () => row || null,
        } as any;
      }

      return {} as any;
    });

    repository = new CassandraUrlRepository();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deve salvar e buscar uma URL", async () => {
    const entity: UrlEntity = {
      shortcode: "abc123",
      long_url: "https://example.com",
      created_at: new Date(),
    };

    await repository.save(entity);
    const result = await repository.findByShortcode("abc123");

    expect(result).not.toBeNull();
    expect(result?.long_url).toBe(entity.long_url);
  });
});
