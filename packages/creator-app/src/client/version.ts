import { apiV2 } from './fetch';

export const VERSIONS_PATH = 'versions';

const versionClient = {
  getVersionSnapshot: (versionID: string, versionName: string, manualSave = true) =>
    apiV2.get(`/${VERSIONS_PATH}/snapshot/${versionID}?manualSave=${manualSave}&saveVersionName=${versionName}`),
};

export default versionClient;
