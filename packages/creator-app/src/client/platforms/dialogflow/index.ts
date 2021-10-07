import { Version } from '@voiceflow/google-dfes-types';

import { googleService } from '@/client/fetch';
import { GOOGLE_SERVICE_ENDPOINT } from '@/config';
import { GoogleStageType } from '@/constants/platforms';
import { Account, DialogflowExportJob, DialogflowPublishJob, GeneralJob } from '@/models';

import {
  createExportService,
  createModelExportService,
  createPrototypeService,
  createPublishService,
  createSessionService,
  createVersionService,
} from '../utils';
import projectService from './project';

const DIALOGFLOW_ENDPOINT = `${GOOGLE_SERVICE_ENDPOINT}/dialogflow/es`;

const dialogflowServiceClient = {
  export: createExportService<DialogflowExportJob.AnyJob, GoogleStageType>(DIALOGFLOW_ENDPOINT),
  modelExport: createModelExportService(googleService),
  project: projectService,
  publish: createPublishService<DialogflowPublishJob.AnyJob, GoogleStageType>(DIALOGFLOW_ENDPOINT),
  session: createSessionService<Account.Google, { code: string }>(DIALOGFLOW_ENDPOINT),
  version: createVersionService<Version.GoogleDFESVersion>(DIALOGFLOW_ENDPOINT),
  prototype: createPrototypeService<GeneralJob.AnyJob>(DIALOGFLOW_ENDPOINT),
};

export default dialogflowServiceClient;
