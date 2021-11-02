import { Models } from '@voiceflow/base-types';

import { GENERAL_SERVICE_ENDPOINT } from '@/config';

import { createProjectService } from '../utils';

const projectGoogleService = {
  ...createProjectService<Models.Project<Models.BasePlatformData, Models.BasePlatformData>>(GENERAL_SERVICE_ENDPOINT),
};

export default projectGoogleService;
