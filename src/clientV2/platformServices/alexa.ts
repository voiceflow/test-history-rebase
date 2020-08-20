import { AlexaPublishing, AlexaSettings, AlexaVersionData } from '@voiceflow/alexa-types';
import axios from 'axios';

import { ALEXA_SERVICE_ENDPOINT } from '@/config';
import { AlexaStageType } from '@/constants/platforms';
import { AlexaJob } from '@/models';

import { PublishService } from './types';

export type AlexaService = PublishService<AlexaJob.AnyJob, AlexaStageType> & {
  updatePlatformData: (versionID: string, platformData: Partial<AlexaVersionData>) => Promise<void>;

  updateSettings: (versionID: string, settings: Partial<AlexaSettings>) => Promise<void>;

  updatePublishing: (versionID: string, settings: Partial<AlexaPublishing>) => Promise<void>;
};

const alexaServiceClient: AlexaService = {
  publish: (projectID) => axios.post(`${ALEXA_SERVICE_ENDPOINT}/publish/${projectID}`).then((res) => res.data),

  cancelPublish: (projectID) => axios.post(`${ALEXA_SERVICE_ENDPOINT}/publish/${projectID}/cancel`).then((res) => res.data),

  getPublishStatus: (projectID) => axios.get(`${ALEXA_SERVICE_ENDPOINT}/publish/${projectID}/status`).then((res) => res.data),

  updatePublishStage: (projectID, stage, data) =>
    axios.post(`${ALEXA_SERVICE_ENDPOINT}/publish/${projectID}/update-stage`, { stage, data }).then((res) => res.data),

  updatePlatformData: (versionID, platformData) => axios.patch(`${ALEXA_SERVICE_ENDPOINT}/version/${versionID}`, platformData),

  updateSettings: (versionID, settings) => axios.patch(`${ALEXA_SERVICE_ENDPOINT}/version/${versionID}/settings`, settings),

  updatePublishing: (versionID, publishing) => axios.patch(`${ALEXA_SERVICE_ENDPOINT}/version/${versionID}/publishing`, publishing),
};

export default alexaServiceClient;
