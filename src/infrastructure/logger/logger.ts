import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL,
  transport: process.env.NODE_ENV !== 'production'
    ? { target: 'pino-pretty' }
    : undefined,
});
