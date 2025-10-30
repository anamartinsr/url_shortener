import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import 'express-async-errors';
import { env } from '../config/env';
import { errorMiddleware } from './middlewares/error.middleware';
import { urlRoutes } from './routes/url.routes';
import { UrlController } from './controllers/url.controller';
import { CreateShortUrlUseCase } from '../../application/usecases/createShortUrl.usecase';
import { GetOriginalUrlUseCase } from '../../application/usecases/getOriginalUrl.usecase';
import { HashidService } from '../../application/services/hashid.service';
import { CassandraUrlRepository } from '../database/cassandra/cassandra.repository';
import { cassandraClient } from '../database/cassandra/cassandra.config';
import { redisClient } from '../database/redis/redis.config';

export async function startServer() {
  try {
    await cassandraClient.connect();
    console.log('Cassandra connected');

    const createTable = `
      CREATE TABLE urls (
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

  const app = express();
  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  const urlRepo = new CassandraUrlRepository();
  const hashService = new HashidService();
  const createUseCase = new CreateShortUrlUseCase(urlRepo, hashService);
  const getUseCase = new GetOriginalUrlUseCase(urlRepo);
  const controller = new UrlController(createUseCase, getUseCase);

  app.use(urlRoutes(controller));

  app.use(errorMiddleware);

  app.listen(env.port, () => {
    console.log(`Server running on port ${env.port}`);
  });
}