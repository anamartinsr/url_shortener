import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import 'express-async-errors';
import { errorMiddleware } from './middlewares/error.middleware';
import { urlRoutes } from './routes/url.routes';
import { UrlController } from './controllers/url.controller';
import { CreateShortUrlUseCase } from '../../application/usecases/createShortUrl.usecase';
import { GetOriginalUrlUseCase } from '../../application/usecases/getOriginalUrl.usecase';
import { HashidService } from '../../application/services/hashid.service';
import { CassandraUrlRepository } from '../database/cassandra/cassandra.repository';
import { cassandraClient } from '../database/cassandra/cassandra.config';
import { redisClient } from '../database/redis/redis.config';

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

export { app, redisClient, cassandraClient };
