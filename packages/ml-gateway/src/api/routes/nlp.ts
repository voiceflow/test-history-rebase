import express from 'express';

import type { ControllersMap } from '../controllers';

const nlpRoutes = (controllers: ControllersMap) => {
  const router = express.Router();

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
