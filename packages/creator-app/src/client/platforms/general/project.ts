import { AnyRecord, BaseModels } from '@voiceflow/base-types';

import { GENERAL_SERVICE_ENDPOINT } from '@/config';

import { createProjectService } from '../utils';

const projectGoogleService = {
  ...createProjectService<BaseModels.Project.Model<AnyRecord, AnyRecord>>(GENERAL_SERVICE_ENDPOINT),
};

export default projectGoogleService;
