import axios from 'axios';

import { Job } from '@/models';
import { Nullable } from '@/types';

export const RESOURCE_ENDPOINT = 'prototype';

const createPrototypeService = <J extends Job>(serviceEndpoint: string, resourceEndpoint = RESOURCE_ENDPOINT) => ({
  run: (projectID: string, diagramID: string | null) =>
    axios.post<{ job: J; projectID: string }>(`${serviceEndpoint}/${resourceEndpoint}/${projectID}/render`, { diagramID }).then((res) => res.data),

  cancel: (projectID: string) => axios.post<void>(`${serviceEndpoint}/${resourceEndpoint}/${projectID}/cancel`).then((res) => res.data),

  getStatus: (projectID: string) => axios.get<Nullable<J>>(`${serviceEndpoint}/${resourceEndpoint}/${projectID}/status`).then((res) => res.data),
});

export default createPrototypeService;
