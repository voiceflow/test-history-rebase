import { GoogleVersion } from '@voiceflow/google-types';
import * as PlatformConfig from '@voiceflow/platform-config';

import { googleService } from '@/client/fetch';
import {
  createJobService,
  createModelExportService,
  createModelImportService,
  createPrototypeService,
  createSessionService,
  createVersionService,
  EXPORT_RESOURCE_ENDPOINT,
  PUBLISH_RESOURCE_ENDPOINT,
} from '@/client/services';
import { GENERAL_SERVICE_ENDPOINT, GOOGLE_SERVICE_ENDPOINT } from '@/config';
import { GoogleStageType } from '@/constants/platforms';
import { GoogleExportJob, GooglePublishJob } from '@/models';

import projectService from './project';

const googleServiceClient = {
  export: createJobService<GoogleExportJob.AnyJob, GoogleStageType>(`${GOOGLE_SERVICE_ENDPOINT}/${EXPORT_RESOURCE_ENDPOINT}`),
  modelExport: createModelExportService(googleService),
  modelImport: createModelImportService(googleService),
  project: projectService,
  publish: createJobService<GooglePublishJob.AnyJob, GoogleStageType>(`${GOOGLE_SERVICE_ENDPOINT}/v2/${PUBLISH_RESOURCE_ENDPOINT}`),
  session: createSessionService<PlatformConfig.Google.Types.Account, { code: string }>(GOOGLE_SERVICE_ENDPOINT),
  version: createVersionService<GoogleVersion.VoiceVersion>(GOOGLE_SERVICE_ENDPOINT),
  prototype: createPrototypeService(GENERAL_SERVICE_ENDPOINT),
};

export default googleServiceClient;
