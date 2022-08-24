import express from 'express';

import type { ControllersMap } from '../controllers';
import nlpRouter from './nlp';

// TO DO: add auth middlewares
const buildRoutes = (controllers: ControllersMap) => {
  const router = express.Router();

  // TO DO: remove this route when we have a proper authentication system
  router.use('*', (_, res) => res.status(403).end());

  router.use('/nlp', nlpRouter(controllers));

  return router;
};

export default buildRoutes;
