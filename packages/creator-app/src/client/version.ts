import { apiV2 } from './fetch';

export const VERSIONS_PATH = 'versions';

const versionClient = {
  getVersionSnapshot: (versionID: string, versionName: string) =>
    apiV2.get(`/${VERSIONS_PATH}/snapshot/${versionID}?manualSave=true&saveVersionName=${versionName}`),
};

export default versionClient;
