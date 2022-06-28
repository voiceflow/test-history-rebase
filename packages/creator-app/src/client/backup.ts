import { BaseModels } from '@voiceflow/base-types';

import { apiV2 } from './fetch';

const backupClient = {
  restore: (projectID: string, versionID: string): Promise<BaseModels.Version.Model<BaseModels.Version.PlatformData>> =>
    apiV2.post(`projects/${projectID}/restore/${versionID}`),
};

export default backupClient;
