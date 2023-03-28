import { AlexaVersion } from '@voiceflow/alexa-types';
import * as PlatformConfig from '@voiceflow/platform-config';

import { alexaService } from '@/client/fetch';
import {
  createJobService,
  createModelExportService,
  createModelImportService,
  createPrototypeService,
  createSessionService,
  createVersionService,
  EXPORT_RESOURCE_ENDPOINT,
  PUBLISH_RESOURCE_ENDPOINT,
} from '@/client/services';
import { ALEXA_SERVICE_ENDPOINT, GENERAL_SERVICE_ENDPOINT } from '@/config';
import { AlexaStageType } from '@/constants/platforms';
import { AlexaExportJob, AlexaPublishJob } from '@/models';

import handlersService from './handlers';
import projectService from './project';

const alexaClient = {
  export: createJobService<AlexaExportJob.AnyJob, AlexaStageType>(`${ALEXA_SERVICE_ENDPOINT}/${EXPORT_RESOURCE_ENDPOINT}`),
  modelExport: createModelExportService(alexaService),
  modelImport: createModelImportService(alexaService),
  project: projectService,
  handlers: handlersService,
  publish: createJobService<AlexaPublishJob.AnyJob, AlexaStageType>(`${ALEXA_SERVICE_ENDPOINT}/${PUBLISH_RESOURCE_ENDPOINT}`),
  session: createSessionService<PlatformConfig.Alexa.Types.Account, { code: string }>(ALEXA_SERVICE_ENDPOINT),
  version: createVersionService<AlexaVersion.Version>(ALEXA_SERVICE_ENDPOINT),
  prototype: createPrototypeService(GENERAL_SERVICE_ENDPOINT),
};

export default alexaClient;
