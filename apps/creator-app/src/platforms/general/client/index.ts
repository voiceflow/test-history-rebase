import { VoiceflowVersion } from '@voiceflow/voiceflow-types';

import { generalService } from '@/client/fetch';
import {
  createJobService,
  createModelExportService,
  createModelImportService,
  createPrototypeService,
  createVersionService,
  EXPORT_RESOURCE_ENDPOINT,
  PUBLISH_RESOURCE_ENDPOINT,
} from '@/client/services';
import { GENERAL_SERVICE_ENDPOINT } from '@/config';
import { GeneralStageType, NLPTrainStageType } from '@/constants/platforms';
import { GeneralExportJob, NLPTrainJob } from '@/models';

import projectService from './project';
import ttsService from './tts';

const generalServiceClient = {
  tts: ttsService,
  export: createJobService<GeneralExportJob.AnyJob, GeneralStageType>(`${GENERAL_SERVICE_ENDPOINT}/${EXPORT_RESOURCE_ENDPOINT}`),
  train: createJobService<NLPTrainJob.AnyJob, NLPTrainStageType>(`${GENERAL_SERVICE_ENDPOINT}/train`),
  modelExport: createModelExportService(generalService),
  modelImport: createModelImportService(generalService),
  project: projectService,
  publish: createJobService(`${GENERAL_SERVICE_ENDPOINT}/${PUBLISH_RESOURCE_ENDPOINT}`),
  version: createVersionService<VoiceflowVersion.Version>(GENERAL_SERVICE_ENDPOINT),
  prototype: createPrototypeService(GENERAL_SERVICE_ENDPOINT),
};

export default generalServiceClient;
