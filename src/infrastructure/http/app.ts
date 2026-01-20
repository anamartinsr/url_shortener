import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import 'express-async-errors';

import { urlRoutes } from './routes/url.routes';
import { docsRouter } from './routes/docs.routes';
import { errorMiddleware } from './middlewares/error.middleware';
import { UrlController } from './controllers/url.controller';
import { CreateShortUrlUseCase } from '../../application/usecases/createShortUrl.usecase';
import { GetOriginalUrlUseCase } from '../../application/usecases/getOriginalUrl.usecase';
import { HashidService } from '../../application/services/hashid.service';
import { CassandraUrlRepository } from '../database/cassandra/cassandra.repository';
import { cassandraClient } from '../database/cassandra/cassandra.config';
import { redisClient } from '../database/redis/redis.config';
import { RedisUrlCacheRepository  } from './../../infrastructure/database/redis/redis.cache';


const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

const urlRepo = new CassandraUrlRepository();
const hashService = new HashidService();
const cacheRepo = new RedisUrlCacheRepository();
const createUseCase = new CreateShortUrlUseCase(urlRepo, hashService, cacheRepo);
const getUseCase = new GetOriginalUrlUseCase(urlRepo, cacheRepo);

const controller = new UrlController(createUseCase, getUseCase);

app.use('/api/docs', docsRouter);
app.use(urlRoutes(controller));
app.use(errorMiddleware);

export { app, redisClient, cassandraClient };
