import { AlexaVersion } from '@voiceflow/alexa-types';

import { alexaService } from '@/client/fetch';
import {
  createExportService,
  createModelExportService,
  createPrototypeService,
  createPublishService,
  createSessionService,
  createVersionService,
} from '@/client/services';
import { ALEXA_SERVICE_ENDPOINT } from '@/config';
import { AlexaStageType } from '@/constants/platforms';
import { Account, AlexaExportJob, AlexaPublishJob, GeneralJob } from '@/models';

import handlersService from './handlers';
import projectService from './project';

const alexaClient = {
  export: createExportService<AlexaExportJob.AnyJob, AlexaStageType>(ALEXA_SERVICE_ENDPOINT),
  modelExport: createModelExportService(alexaService),
  project: projectService,
  handlers: handlersService,
  publish: createPublishService<AlexaPublishJob.AnyJob, AlexaStageType>(ALEXA_SERVICE_ENDPOINT),
  session: createSessionService<Account.Amazon, { code: string }>(ALEXA_SERVICE_ENDPOINT),
  version: createVersionService<AlexaVersion.Version>(ALEXA_SERVICE_ENDPOINT),
  prototype: createPrototypeService<GeneralJob.AnyJob>(ALEXA_SERVICE_ENDPOINT),
};

export default alexaClient;
