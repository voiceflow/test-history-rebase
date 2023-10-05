import express, { Router } from 'express';

import type { ControllersMap } from '../controllers';
import type { MiddlewaresMap } from '../middlewares';

const nlpRoutes = (middlewares: MiddlewaresMap, controllers: ControllersMap): Router => {
  const router = express.Router();

  router.use(middlewares.auth.authenticateUser);

  router.post('/predict/:appID', controllers.nlp.predict);

  router.post('/app', controllers.nlp.createApplication);
  router.get('/app/:appID', controllers.nlp.getApplication);

  router.post('/publish/:appID', controllers.nlp.publish);
  router.get('/publish/:appID/status', controllers.nlp.getPublishStatus);
  router.post('/publish/:appID/update-stage', controllers.nlp.updatePublishStage);
  router.post('/publish/:appID/cancel', controllers.nlp.cancelPublish);
  router.get('/publish/:appID/export', controllers.nlp.publishExport);

  return router;
};

export default nlpRoutes;
