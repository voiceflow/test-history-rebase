import { AbstractControl } from '../control';

// TODO: Implement NLP Service methods
class NLPService extends AbstractControl {
  createApplication(app: any) {
    return { ...app };
  }

  getApplication(appID: string) {
    return { appID };
  }

  publish(appID: string) {
    return { appID };
  }

  predict(appID: string) {
    return { appID };
  }

  getPublishStatus(appID: string) {
    return { appID };
  }

  updatePublishStage(appID: string) {
    return { appID };
  }

  cancelPublish(appID: string) {
    return { appID };
  }

  publishExport(appID: string) {
    return { appID };
  }
}

export default NLPService;
