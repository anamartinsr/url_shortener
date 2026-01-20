import { app, redisClient, cassandraClient } from './app';
import { env } from '../config/env';

export async function startServer() {
  try {
    await cassandraClient.connect();
    console.log('Cassandra connected');
  } catch (err) {
    console.error('Cassandra connection failed', err);
    process.exit(1);
  }

  redisClient.on('error', console.error);
  redisClient.on('connect', () => console.log('Redis connected'));

  app.listen(env.port, () => {
    console.log(`Server running on port ${env.port}`);
  });
}

startServer();
