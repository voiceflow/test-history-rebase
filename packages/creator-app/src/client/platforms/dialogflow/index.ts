import { Version } from '@voiceflow/google-dfes-types';

import { googleService } from '@/client/fetch';
import { GOOGLE_SERVICE_ENDPOINT } from '@/config';
import { GoogleStageType } from '@/constants/platforms';
import { Account, GeneralJob, GoogleExportJob, GooglePublishJob } from '@/models';

import {
  createExportService,
  createModelExportService,
  createPrototypeService,
  createPublishService,
  createSessionService,
  createVersionService,
} from '../utils';
import projectService from './project';

const dialogflowServiceClient = {
  export: createExportService<GoogleExportJob.AnyJob, GoogleStageType>(GOOGLE_SERVICE_ENDPOINT),
  modelExport: createModelExportService(googleService),
  project: projectService,
  publish: createPublishService<GooglePublishJob.AnyJob, GoogleStageType>(`${GOOGLE_SERVICE_ENDPOINT}/dialogflow/es`),
  session: createSessionService<Account.Google, { code: string }>(GOOGLE_SERVICE_ENDPOINT),
  version: createVersionService<Version.GoogleDFESVersionData, Version.GoogleDFESVersionPublishing, Version.GoogleDFESVersionData>(
    GOOGLE_SERVICE_ENDPOINT
  ),
  prototype: createPrototypeService<GeneralJob.AnyJob>(GOOGLE_SERVICE_ENDPOINT),
};

export default dialogflowServiceClient;
