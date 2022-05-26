import axios from 'axios';

import { Job } from '@/models';

export const RESOURCE_ENDPOINT = 'prototype';

const createPrototypeService = <J extends Job>(serviceEndpoint: string, resourceEndpoint = RESOURCE_ENDPOINT) => ({
  renderSync: (versionID: string) => axios.post<{ job: J; projectID: string }>(`${serviceEndpoint}/${resourceEndpoint}/${versionID}/renderSync`),
});

export default createPrototypeService;
