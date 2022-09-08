import axios from 'axios';

import { PrototypeRenderSyncOptions } from '@/constants/prototype';
import { Job } from '@/models';

export const RESOURCE_ENDPOINT = 'prototype';

const createPrototypeService = <J extends Job>(serviceEndpoint: string, resourceEndpoint = RESOURCE_ENDPOINT) => ({
  renderSync: (versionID: string, renderOptions?: PrototypeRenderSyncOptions) =>
    axios.post<{ job: J; projectID: string }>(`${serviceEndpoint}/${resourceEndpoint}/${versionID}/renderSync`, { compilerOptions: renderOptions }),
});

export default createPrototypeService;
