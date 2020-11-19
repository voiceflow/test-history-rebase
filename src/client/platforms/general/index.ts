import { GeneralSettings, GeneralVersionData, Voice } from '@voiceflow/general-types';

import { GENERAL_SERVICE_ENDPOINT } from '@/config';
import { GeneralStageType } from '@/constants/platforms';
import { GeneralJob } from '@/models';

import { createExportService, createPrototypeService, createVersionService } from '../utils';
import projectService from './project';
import publishService from './publish';

const googleServiceClient = {
  export: createExportService<GeneralJob.AnyJob, GeneralStageType>(GENERAL_SERVICE_ENDPOINT),
  project: projectService,
  publish: publishService(),
  version: createVersionService<GeneralSettings<Voice>, {}, GeneralVersionData<Voice>>(GENERAL_SERVICE_ENDPOINT),
  prototype: createPrototypeService<GeneralJob.AnyJob>(GENERAL_SERVICE_ENDPOINT),
};

export default googleServiceClient;
