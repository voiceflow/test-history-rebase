import { GeneralVersionData, GeneralVersionSettings } from '@voiceflow/general-types';

import { generalService } from '@/client/fetch';
import { GENERAL_SERVICE_ENDPOINT } from '@/config';
import { GeneralStageType } from '@/constants/platforms';
import { GeneralJob } from '@/models';

import { createExportService, createModelExportService, createPrototypeService, createVersionService } from '../utils';
import createNLPService from './nlp';
import projectService from './project';
import publishService from './publish';
import ttsService from './tts';

const generalServiceClient = {
  nlp: createNLPService(GENERAL_SERVICE_ENDPOINT),
  tts: ttsService,
  export: createExportService<GeneralJob.AnyJob, GeneralStageType>(GENERAL_SERVICE_ENDPOINT),
  modelExport: createModelExportService(generalService),
  project: projectService,
  publish: publishService(),
  version: createVersionService<GeneralVersionSettings, {}, GeneralVersionData>(GENERAL_SERVICE_ENDPOINT),
  prototype: createPrototypeService<GeneralJob.AnyJob>(GENERAL_SERVICE_ENDPOINT),
};

export default generalServiceClient;
