import axios from 'axios';

import { ALEXA_SERVICE_ENDPOINT } from '@/config';
import { PrototypeJob } from '@/models';
import { Nullable } from '@/types';

const RESOURCE_ENDPOINT = 'prototype';

const prototypeAlexaService = {
  renderPrototype: (projectID: string) =>
    axios
      .post<{ job: PrototypeJob.AnyJob; projectID: string }>(`${ALEXA_SERVICE_ENDPOINT}/${RESOURCE_ENDPOINT}/${projectID}/render`)
      .then((res) => res.data),

  cancelRenderPrototype: (projectID: string) =>
    axios.post<void>(`${ALEXA_SERVICE_ENDPOINT}/${RESOURCE_ENDPOINT}/${projectID}/cancel`).then((res) => res.data),

  getRenderPrototypeStatus: (projectID: string) =>
    axios.get<Nullable<PrototypeJob.AnyJob>>(`${ALEXA_SERVICE_ENDPOINT}/${RESOURCE_ENDPOINT}/${projectID}/status`).then((res) => res.data),
};

export default prototypeAlexaService;
