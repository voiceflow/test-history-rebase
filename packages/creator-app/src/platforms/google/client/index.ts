import { GoogleVersion } from '@voiceflow/google-types';

import { googleService } from '@/client/fetch';
import {
  createExportService,
  createModelExportService,
  createModelImportService,
  createPrototypeService,
  createPublishService,
  createSessionService,
  createVersionService,
} from '@/client/services';
import { GOOGLE_SERVICE_ENDPOINT } from '@/config';
import { GoogleStageType } from '@/constants/platforms';
import { Account, GoogleExportJob, GooglePublishJob } from '@/models';

import projectService from './project';

const googleServiceClient = {
  export: createExportService<GoogleExportJob.AnyJob, GoogleStageType>(GOOGLE_SERVICE_ENDPOINT),
  modelExport: createModelExportService(googleService),
  modelImport: createModelImportService(googleService),
  project: projectService,
  publish: createPublishService<GooglePublishJob.AnyJob, GoogleStageType>(`${GOOGLE_SERVICE_ENDPOINT}/v2`),
  session: createSessionService<Account.Google, { code: string }>(GOOGLE_SERVICE_ENDPOINT),
  version: createVersionService<GoogleVersion.VoiceVersion>(GOOGLE_SERVICE_ENDPOINT),
  prototype: createPrototypeService(GOOGLE_SERVICE_ENDPOINT),
};

export default googleServiceClient;
