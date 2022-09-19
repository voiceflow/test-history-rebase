import { VoiceflowVersion } from '@voiceflow/voiceflow-types';

import { generalService } from '@/client/fetch';
import {
  createExportService,
  createModelExportService,
  createModelImportService,
  createPrototypeService,
  createVersionService,
} from '@/client/services';
import { GENERAL_SERVICE_ENDPOINT } from '@/config';
import { GeneralStageType } from '@/constants/platforms';
import { GeneralExportJob } from '@/models';

import createNLPService from './nlp';
import projectService from './project';
import publishService from './publish';
import ttsService from './tts';

const generalServiceClient = {
  nlp: createNLPService(GENERAL_SERVICE_ENDPOINT),
  tts: ttsService,
  export: createExportService<GeneralExportJob.AnyJob, GeneralStageType>(GENERAL_SERVICE_ENDPOINT),
  modelExport: createModelExportService(generalService),
  modelImport: createModelImportService(generalService),
  project: projectService,
  publish: publishService(),
  version: createVersionService<VoiceflowVersion.Version>(GENERAL_SERVICE_ENDPOINT),
  prototype: createPrototypeService(GENERAL_SERVICE_ENDPOINT),
};

export default generalServiceClient;
