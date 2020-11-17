import axios from 'axios';

import { API_ENDPOINT } from '@/config';

const backupClient = {
  restore: (projectID: string, versionID: string) => axios.post(`${API_ENDPOINT}/v2/projects/${projectID}/restore/${versionID}`),
};

export default backupClient;
