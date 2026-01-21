import { Request, Response, NextFunction } from 'express';
import { logger } from '../../logger/logger';

export function errorMiddleware(err: any, _req: Request, res: Response, _next: NextFunction) {
   logger.error(
    {
      err,
      method: _req.method,
      path: _req.originalUrl,
    },
    'Unhandled error'
  );

  return res.status(500).json({ message: 'Internal server error' });
}
