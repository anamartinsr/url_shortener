import pino from 'pino';

const isTest = process.env.NODE_ENV === 'test';

export const logger = pino(
  isTest
    ? { level: 'silent' }
    : {
        level: process.env.LOG_LEVEL ?? 'info',
        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty' }
            : undefined,
      }
);
  