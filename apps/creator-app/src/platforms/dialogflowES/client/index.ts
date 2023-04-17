import { DFESVersion } from '@voiceflow/google-dfes-types';

import { googleService } from '@/client/fetch';
import {
  createJobService,
  createModelExportService,
  createModelImportService,
  createPrototypeService,
  createVersionService,
  PUBLISH_RESOURCE_ENDPOINT,
} from '@/client/services';
import { GENERAL_SERVICE_ENDPOINT, GOOGLE_SERVICE_ENDPOINT } from '@/config';
import { GoogleStageType } from '@/constants/platforms';
import { DialogflowESPublishJob } from '@/models';

import projectService from './project';

const DIALOGFLOW_ENDPOINT = `${GOOGLE_SERVICE_ENDPOINT}/dialogflow/es`;

const dialogflowServiceClient = {
  export: null,
  modelExport: createModelExportService(googleService),
  modelImport: createModelImportService(googleService),
  project: projectService,
  publish: createJobService<DialogflowESPublishJob.AnyJob, GoogleStageType>(`${DIALOGFLOW_ENDPOINT}/${PUBLISH_RESOURCE_ENDPOINT}`),
  version: createVersionService<DFESVersion.Version>(DIALOGFLOW_ENDPOINT),
  prototype: createPrototypeService(GENERAL_SERVICE_ENDPOINT),
};

export default dialogflowServiceClient;
