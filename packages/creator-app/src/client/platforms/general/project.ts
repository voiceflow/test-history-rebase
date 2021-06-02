import { BasePlatformData, Project } from '@voiceflow/api-sdk';

import { GENERAL_SERVICE_ENDPOINT } from '@/config';

import { createProjectService } from '../utils';

const projectGoogleService = {
  ...createProjectService<Project<BasePlatformData, BasePlatformData>>(GENERAL_SERVICE_ENDPOINT),
};

export default projectGoogleService;
