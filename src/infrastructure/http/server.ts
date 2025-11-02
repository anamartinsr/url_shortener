import { app, redisClient, cassandraClient } from './app';
import { env } from '../config/env';

export async function startServer() {
  try {
    await cassandraClient.connect();
    console.log('Cassandra connected');

    const createTable = `
      CREATE TABLE IF NOT EXISTS url (
        shortcode text PRIMARY KEY,
        long_url text,
        created_at timestamp
      );
    `;
    await cassandraClient.execute(createTable);
    console.log('Ensured Cassandra table exists');
  } catch (err) {
    console.error('Cassandra connection failed', err);
  }

  redisClient.on('error', (e) => console.error('Redis error', e));
  redisClient.on('connect', () => console.log('Redis connected'));

  app.listen(env.port, () => {
    console.log(`Server running on port ${env.port}`);
  });
}

startServer();
