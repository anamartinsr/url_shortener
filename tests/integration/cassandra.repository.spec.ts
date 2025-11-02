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

import { CassandraUrlRepository } from "../../src/infrastructure/database/cassandra/cassandra.repository";
import { cassandraClient } from "../../src/infrastructure/database/cassandra/cassandra.config";
import { UrlEntity } from "../../src/domain/entities/url.entity";

const cassandraMock = cassandraClient as unknown as jest.Mocked<
  typeof cassandraClient
>;

const mockDb: Record<string, UrlEntity> = {};

describe("CassandraUrlRepository (integration - mock)", () => {
  let repository: CassandraUrlRepository;

  beforeAll(async () => {
    cassandraMock.connect.mockImplementation(async () => {});
    cassandraMock.shutdown.mockImplementation(async () => {});

    cassandraMock.execute.mockImplementation(async (...args: any[]) => {
      const query = args[0] as string;
      const params = args[1] as any[] | undefined;

      const q = query.toLowerCase();

      if (q.includes("insert") && params) {
        const [shortcode, long_url, created_at] = params;
        mockDb[shortcode] = { shortcode, long_url, created_at };
        return { rows: [], rowLength: 0, first: () => null } as any;
      }
      if (q.includes("select") && params) {
        const shortcode = params[0];
        const row = mockDb[shortcode];
        return {
          rows: row ? [row] : [],
          rowLength: row ? 1 : 0,
          first: () => row || null,
        } as any;
      }
      return { rows: [], rowLength: 0, first: () => null } as any;
    });

    await cassandraMock.connect();
    repository = new CassandraUrlRepository();
  });

  afterAll(async () => {
    await cassandraMock.shutdown();
  });

  it("deve salvar e buscar uma URL corretamente", async () => {
    const urlEntity: UrlEntity = {
      shortcode: "abc123",
      long_url: "https://example.com/integration",
      created_at: new Date(),
    };

    await repository.save(urlEntity);
    const result = await repository.findByShortcode(urlEntity.shortcode);

    expect(result).not.toBeNull();
    expect(result?.shortcode).toBe(urlEntity.shortcode);
    expect(result?.long_url).toBe(urlEntity.long_url);
  });
});
