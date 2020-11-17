import axios from 'axios';

import { Job } from '@/models';
import { Nullable } from '@/types';

export const RESOURCE_ENDPOINT = 'prototype';

const createPrototypeService = <J extends Job>(serviceEndpoint: string) => ({
  run: (projectID: string) =>
    axios.post<{ job: J; projectID: string }>(`${serviceEndpoint}/${RESOURCE_ENDPOINT}/${projectID}/render`).then((res) => res.data),

  cancel: (projectID: string) => axios.post<void>(`${serviceEndpoint}/${RESOURCE_ENDPOINT}/${projectID}/cancel`).then((res) => res.data),

  getStatus: (projectID: string) => axios.get<Nullable<J>>(`${serviceEndpoint}/${RESOURCE_ENDPOINT}/${projectID}/status`).then((res) => res.data),
});

export default createPrototypeService;
