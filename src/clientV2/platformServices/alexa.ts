import { AlexaPublishing, AlexaSettings, AlexaVersionData } from '@voiceflow/alexa-types';
import axios from 'axios';

import { ALEXA_SERVICE_ENDPOINT } from '@/config';
import { AlexaStageType } from '@/constants/platforms';
import { AlexaJob, PrototypeJob } from '@/models';
import { Nullable } from '@/types';

import { PublishService } from './types';

export type AlexaService = PublishService<AlexaJob.AnyJob, AlexaStageType> & {
  updatePlatformData: (versionID: string, platformData: Partial<AlexaVersionData>) => Promise<void>;

  updateSettings: (versionID: string, settings: Partial<AlexaSettings>) => Promise<void>;

  updatePublishing: (versionID: string, settings: Partial<AlexaPublishing>) => Promise<void>;

  renderPrototype: (projectID: string) => Promise<{ job: PrototypeJob.AnyJob; projectID: string }>;

  cancelRenderPrototype: (projectID: string) => Promise<void>;

  getRenderPrototypeStatus: (projectID: string) => Promise<Nullable<PrototypeJob.AnyJob>>;
};

const alexaServiceClient: AlexaService = {
  publish: (projectID) => axios.post(`${ALEXA_SERVICE_ENDPOINT}/publish/${projectID}`).then((res) => res.data),

  cancelPublish: (projectID) => axios.post(`${ALEXA_SERVICE_ENDPOINT}/publish/${projectID}/cancel`).then((res) => res.data),

  getPublishStatus: (projectID) => axios.get(`${ALEXA_SERVICE_ENDPOINT}/publish/${projectID}/status`).then((res) => res.data),

  updatePublishStage: (projectID, stage, data) =>
    axios.post(`${ALEXA_SERVICE_ENDPOINT}/publish/${projectID}/update-stage`, { stage, data }).then((res) => res.data),

  renderPrototype: (projectID) => axios.post(`${ALEXA_SERVICE_ENDPOINT}/prototype/${projectID}/render`).then((res) => res.data),

  cancelRenderPrototype: (projectID) => axios.post(`${ALEXA_SERVICE_ENDPOINT}/prototype/${projectID}/cancel`).then((res) => res.data),

  getRenderPrototypeStatus: (projectID) => axios.get(`${ALEXA_SERVICE_ENDPOINT}/prototype/${projectID}/status`).then((res) => res.data),

  copyProject: (projectID, data) => axios.post(`${ALEXA_SERVICE_ENDPOINT}/project/${projectID}/copy`, data).then((res) => res.data),

  updatePlatformData: (versionID, platformData) => axios.patch(`${ALEXA_SERVICE_ENDPOINT}/version/${versionID}`, platformData),

  updateSettings: (versionID, settings) => axios.patch(`${ALEXA_SERVICE_ENDPOINT}/version/${versionID}/settings`, settings),

  updatePublishing: (versionID, publishing) => axios.patch(`${ALEXA_SERVICE_ENDPOINT}/version/${versionID}/publishing`, publishing),
};

export default alexaServiceClient;
