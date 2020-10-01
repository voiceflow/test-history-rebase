import { GooglePublishing, GoogleSettings, GoogleVersionData } from '@voiceflow/google-types';

import { GOOGLE_SERVICE_ENDPOINT } from '@/config';
import { GoogleStageType } from '@/constants/platforms';
import { Account, GoogleExportJob, GooglePublishJob, PrototypeJob } from '@/models';

import { createExportService, createPrototypeService, createPublishService, createSessionService, createVersionService } from '../utils';
import projectService from './project';

const googleServiceClient = {
  export: createExportService<GoogleExportJob.AnyJob, GoogleStageType>(GOOGLE_SERVICE_ENDPOINT),
  project: projectService,
  publish: createPublishService<GooglePublishJob.AnyJob, GoogleStageType>(GOOGLE_SERVICE_ENDPOINT),
  session: createSessionService<Account.Google, { code: string }>(GOOGLE_SERVICE_ENDPOINT),
  version: createVersionService<GoogleSettings, GooglePublishing, GoogleVersionData>(GOOGLE_SERVICE_ENDPOINT),
  prototype: createPrototypeService<PrototypeJob.AnyJob>(GOOGLE_SERVICE_ENDPOINT),
};

export default googleServiceClient;
