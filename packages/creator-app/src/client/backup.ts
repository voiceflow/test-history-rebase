import { apiV2 } from './fetch';

const backupClient = {
  restore: (projectID: string, versionID: string) => apiV2.post(`projects/${projectID}/restore/${versionID}`),
};

export default backupClient;
