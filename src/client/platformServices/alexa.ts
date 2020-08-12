import axios from 'axios';

import { ALEXA_SERVICE_ENDPOINT } from '@/config';
import { AlexaStageType } from '@/constants/platforms';
import { AlexaJob } from '@/models';

import { PlatformService } from './types';

const alexaServiceClient: PlatformService<AlexaJob.AnyJob, AlexaStageType> = {
  publish: (projectID: string) => axios.post(`${ALEXA_SERVICE_ENDPOINT}/publish/${projectID}`).then((res) => res.data),

  cancelPublish: (projectID: string) => axios.post(`${ALEXA_SERVICE_ENDPOINT}/publish/${projectID}/cancel`).then((res) => res.data),

  getPublishStatus: (projectID: string) => axios.get(`${ALEXA_SERVICE_ENDPOINT}/publish/${projectID}/status`).then((res) => res.data),

  updatePublishStage: (projectID: string, stage: AlexaStageType, data: unknown) =>
    axios.post(`${ALEXA_SERVICE_ENDPOINT}/publish/${projectID}/update-stage`, { stage, data }).then((res) => res.data),
};

export default alexaServiceClient;
