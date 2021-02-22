import { GoogleVersionData, GoogleVersionPublishing, GoogleVersionSettings } from '@voiceflow/google-types';

import { GOOGLE_SERVICE_ENDPOINT } from '@/config';
import { GoogleStageType } from '@/constants/platforms';
import { Account, GeneralJob, GoogleExportJob, GooglePublishJob } from '@/models';

import { createExportService, createPrototypeService, createPublishService, createSessionService, createVersionService } from '../utils';
import modelExport from './modelExport';
import projectService from './project';

const googleServiceClient = {
  export: createExportService<GoogleExportJob.AnyJob, GoogleStageType>(GOOGLE_SERVICE_ENDPOINT),
  modelExport,
  project: projectService,
  publish: createPublishService<GooglePublishJob.AnyJob, GoogleStageType>(GOOGLE_SERVICE_ENDPOINT),
  session: createSessionService<Account.Google, { code: string }>(GOOGLE_SERVICE_ENDPOINT),
  version: createVersionService<GoogleVersionSettings, GoogleVersionPublishing, GoogleVersionData>(GOOGLE_SERVICE_ENDPOINT),
  prototype: createPrototypeService<GeneralJob.AnyJob>(GOOGLE_SERVICE_ENDPOINT),
};

export default googleServiceClient;
