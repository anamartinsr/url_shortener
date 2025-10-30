
import './infrastructure/config/env';
import { startServer } from './infrastructure/http/server';

(async () => {
  try {
    await startServer();
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();
