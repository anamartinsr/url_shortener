import cassandra from 'cassandra-driver';
import { env } from '../src/infrastructure/config/env';

async function run() {
  const client = new cassandra.Client({
    contactPoints: env.cassandraContactPoints,
    localDataCenter: env.cassandraLocalDc,
    credentials: {
      username: env.cassandraUser,
      password: env.cassandraPassword,
    },
  });

  await client.connect();

  await client.execute(`
    CREATE KEYSPACE IF NOT EXISTS ${env.cassandraKeyspace}
    WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1};
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS ${env.cassandraKeyspace}.url (
      shortcode text PRIMARY KEY,
      long_url text,
      created_at timestamp
    );
  `);

  await client.shutdown();

  console.log('Migration executed successfully');
}

run().catch(console.error);
