import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';

import type { ControllersMap } from '../controllers';
import type { MiddlewaresMap } from '../middlewares';
import generationRouter from './generation';
import nlpRouter from './nlp';

// TODO: add auth middlewares
const buildRoutes = ({ controllers, middlewares }: { controllers: ControllersMap; middlewares: MiddlewaresMap }) => {
  const router = express.Router();

  // Reflect requested object for effectively a wildcard CORS setting
  const corsOptions = {
    origin: true,
    credentials: true,
  };

  router.use(cors(corsOptions));
  router.use(cookieParser());
  router.use(bodyParser.json());

  router.use('/nlp', nlpRouter(middlewares, controllers));

  router.use('/generation', generationRouter(middlewares, controllers));

  return router;
};

export default buildRoutes;
