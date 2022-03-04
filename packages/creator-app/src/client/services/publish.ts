import { Nullable } from '@voiceflow/common';
import axios from 'axios';

import { Job } from '@/models';

export const RESOURCE_ENDPOINT = 'publish';

const createPublishService = <J extends Job, S extends string>(serviceEndpoint: string) => ({
  run: (projectID: string, submit = false) =>
    axios.post<{ job: J; projectID: string }>(`${serviceEndpoint}/${RESOURCE_ENDPOINT}/${projectID}`, { submit }).then((res) => res.data),

  cancel: (projectID: string) => axios.post<void>(`${serviceEndpoint}/${RESOURCE_ENDPOINT}/${projectID}/cancel`).then((res) => res.data),

  getStatus: (projectID: string) => axios.get<Nullable<J>>(`${serviceEndpoint}/${RESOURCE_ENDPOINT}/${projectID}/status`).then((res) => res.data),

  updateStage: (projectID: string, stage: S, data: unknown) =>
    axios.post<void>(`${serviceEndpoint}/${RESOURCE_ENDPOINT}/${projectID}/update-stage`, { stage, data }).then((res) => res.data),
});

export default createPublishService;
