import type { Nullable } from '@voiceflow/common';
import axios from 'axios';

import type { Job, JobClient } from '@/models';

export const PUBLISH_RESOURCE_ENDPOINT = 'publish';
export const EXPORT_RESOURCE_ENDPOINT = 'export';

const createJobService = <J extends Job, S extends string>(serviceEndpoint: string): JobClient<J, S> => ({
  run: (projectID: string, options: Record<string, unknown>) =>
    axios.post<{ job: J; projectID: string }>(`${serviceEndpoint}/${projectID}`, options).then((res) => res.data),

  cancel: (projectID: string) => axios.post<void>(`${serviceEndpoint}/${projectID}/cancel`).then((res) => res.data),

  getStatus: (projectID: string) =>
    axios.get<Nullable<J>>(`${serviceEndpoint}/${projectID}/status`).then((res) => res.data),

  updateStage: (projectID: string, stage: S, data: unknown) =>
    axios.post<void>(`${serviceEndpoint}/${projectID}/update-stage`, { stage, data }).then((res) => res.data),
});

export default createJobService;
