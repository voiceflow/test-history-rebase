import { GeneralSettings, GeneralVersionData, Voice } from '@voiceflow/general-types';

import { GENERAL_SERVICE_ENDPOINT } from '@/config';
import { PrototypeJob } from '@/models';

import { createPrototypeService, createVersionService } from '../utils';
import exportService from './export';
import projectService from './project';
import publishService from './publish';

const googleServiceClient = {
  export: exportService(),
  project: projectService,
  publish: publishService(),
  version: createVersionService<GeneralSettings<Voice>, {}, GeneralVersionData<Voice>>(GENERAL_SERVICE_ENDPOINT),
  prototype: createPrototypeService<PrototypeJob.AnyJob>(GENERAL_SERVICE_ENDPOINT),
};

export default googleServiceClient;
