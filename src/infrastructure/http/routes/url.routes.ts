import { Router } from 'express';
import { UrlController } from '../controllers/url.controller';
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "../../../../swagger.json";

export function urlRoutes(controller: UrlController): Router {
  const router = Router();

  router.post('/api/shorten', controller.create);
  router.get('/health', controller.health);
  router.get('/:shortcode', controller.redirect);
  router.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  return router;
}
