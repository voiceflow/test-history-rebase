import { AnyRecord, BaseModels } from '@voiceflow/base-types';

import { createProjectService } from '@/client/services';
import { GENERAL_SERVICE_ENDPOINT } from '@/config';

const projectGoogleService = {
  ...createProjectService<BaseModels.Project.Model<AnyRecord, AnyRecord>>(GENERAL_SERVICE_ENDPOINT),
};

export default projectGoogleService;
