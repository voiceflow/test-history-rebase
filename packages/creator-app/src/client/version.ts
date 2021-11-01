import { apiV2 } from './fetch';

export const VERSIONS_PATH = 'versions';

const versionClient = {
  getVersionSnapshot: (versionID: string) => apiV2.get(`/${VERSIONS_PATH}/snapshot/${versionID}`),
};

export default versionClient;
