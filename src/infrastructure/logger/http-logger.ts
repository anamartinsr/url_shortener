import pinoHttp from 'pino-http';
import { logger } from './logger';

export const httpLogger = pinoHttp({
  logger,
  serializers: {
    req(req) {
      return {
        method: req.method,
        url: req.url,
      };
    },
  },
});
