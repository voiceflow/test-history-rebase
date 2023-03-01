import { ApiRequest } from '../types';
import { AbstractController } from './utils';

// TODO: Create payload types and validations
class NLPController extends AbstractController {
  createApplication(req: ApiRequest) {
    return this.services.nlp.createApplication(req.body);
  }

  getApplication(req: ApiRequest<{ appID: string }>) {
    return this.services.nlp.getApplication(req.params.appID);
  }

  publish(req: ApiRequest<{ appID: string }>) {
    return this.services.nlp.publish(req.params.appID);
  }

  predict(req: ApiRequest<{ appID: string }>) {
    return this.services.nlp.predict(req.params.appID);
  }

  getPublishStatus(req: ApiRequest<{ appID: string }>) {
    return this.services.nlp.getPublishStatus(req.params.appID);
  }

  updatePublishStage(req: ApiRequest<{ appID: string }>) {
    return this.services.nlp.updatePublishStage(req.params.appID);
  }

  cancelPublish(req: ApiRequest<{ appID: string }>) {
    return this.services.nlp.cancelPublish(req.params.appID);
  }

  publishExport(req: ApiRequest<{ appID: string }>) {
    return this.services.nlp.publishExport(req.params.appID);
  }
}

export default NLPController;
