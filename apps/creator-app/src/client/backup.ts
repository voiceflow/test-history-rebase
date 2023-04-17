import { BaseVersion } from '@voiceflow/base-types';

import { apiV2 } from './fetch';

const backupClient = {
  restore: (projectID: string, versionID: string): Promise<BaseVersion.Version> => apiV2.post(`projects/${projectID}/restore/${versionID}`),
};

export default backupClient;
