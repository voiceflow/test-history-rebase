import { DFESVersion } from '@voiceflow/google-dfes-types';

import { googleService } from '@/client/fetch';
import {
  createModelExportService,
  createModelImportService,
  createPrototypeService,
  createPublishService,
  createVersionService,
} from '@/client/services';
import { GOOGLE_SERVICE_ENDPOINT } from '@/config';
import { GoogleStageType } from '@/constants/platforms';
import { DialogflowESPublishJob } from '@/models';

import projectService from './project';

const DIALOGFLOW_ENDPOINT = `${GOOGLE_SERVICE_ENDPOINT}/dialogflow/es`;

const dialogflowServiceClient = {
  export: null,
  modelExport: createModelExportService(googleService),
  modelImport: createModelImportService(googleService),
  project: projectService,
  publish: createPublishService<DialogflowESPublishJob.AnyJob, GoogleStageType>(DIALOGFLOW_ENDPOINT),
  version: createVersionService<DFESVersion.Version>(DIALOGFLOW_ENDPOINT),
  prototype: createPrototypeService(DIALOGFLOW_ENDPOINT),
};

export default dialogflowServiceClient;
