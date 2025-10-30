import { Router } from 'express';
import { UrlController } from '../controllers/url.controller';

export function urlRoutes(controller: UrlController): Router {
  const router = Router();

  router.post('/api/shorten', controller.create);
  router.get('/health', controller.health);
  router.get('/:shortcode', controller.redirect);

  return router;
}
