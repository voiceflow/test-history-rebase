import express from 'express';

import type { ControllersMap } from '../controllers';
import type { MiddlewaresMap } from '../middlewares';

const generationRoutes = (middlewares: MiddlewaresMap, controllers: ControllersMap) => {
  const router = express.Router();

  router.use(middlewares.auth.authenticateUser);
  router.use(middlewares.billing.checkQuota);

  router.post('/utterance', controllers.generation.utterance);

  router.post('/prompt', controllers.generation.prompt);

  router.post('/entity-values', controllers.generation.entityValue);

  router.post('/entity-prompt', controllers.generation.entityReprompt);

  return router;
};

export default generationRoutes;
