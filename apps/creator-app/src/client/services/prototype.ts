import axios from 'axios';

import { PrototypeRenderSyncOptions } from '@/constants/prototype';

export const RESOURCE_ENDPOINT = 'prototype';

const createPrototypeService = (serviceEndpoint: string, resourceEndpoint = RESOURCE_ENDPOINT) => ({
  renderSync: (versionID: string, renderOptions?: PrototypeRenderSyncOptions) =>
    axios.post<{ projectID: string }>(`${serviceEndpoint}/${resourceEndpoint}/${versionID}/renderSync`, { compilerOptions: renderOptions }),
});

export default createPrototypeService;
