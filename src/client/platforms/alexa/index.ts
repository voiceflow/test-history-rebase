import { AlexaPublishing, AlexaSettings, AlexaVersionData } from '@voiceflow/alexa-types';

import { ALEXA_SERVICE_ENDPOINT } from '@/config';
import { AlexaStageType } from '@/constants/platforms';
import { Account, AlexaExportJob, AlexaPublishJob, GeneralJob } from '@/models';

import { createExportService, createPrototypeService, createPublishService, createSessionService, createVersionService } from '../utils';
import handlersService from './handlers';
import projectService from './project';

const alexaServiceClient = {
  export: createExportService<AlexaExportJob.AnyJob, AlexaStageType>(ALEXA_SERVICE_ENDPOINT),
  project: projectService,
  handlers: handlersService,
  publish: createPublishService<AlexaPublishJob.AnyJob, AlexaStageType>(ALEXA_SERVICE_ENDPOINT),
  session: createSessionService<Account.Amazon, { code: string }>(ALEXA_SERVICE_ENDPOINT),
  version: createVersionService<AlexaSettings, AlexaPublishing, AlexaVersionData>(ALEXA_SERVICE_ENDPOINT),
  prototype: createPrototypeService<GeneralJob.AnyJob>(ALEXA_SERVICE_ENDPOINT),
  prototypeV2: createPrototypeService<GeneralJob.AnyJob>(ALEXA_SERVICE_ENDPOINT, 'prototypeV2'),
};

export default alexaServiceClient;
