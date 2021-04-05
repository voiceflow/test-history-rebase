import axios from 'axios';

import { NLPTrainJob } from '@/models';
import { Nullable } from '@/types';

const createNLPService = (serviceEndpoint: string) => ({
  publish: (projectID: string) =>
    axios.post<{ job: NLPTrainJob.AnyJob; appID: string }>(`${serviceEndpoint}/nlp/${projectID}/publish`).then((res) => res.data),

  status: (projectID: string) => axios.get<Nullable<NLPTrainJob.AnyJob>>(`${serviceEndpoint}/nlp/${projectID}/status`).then((res) => res.data),

  cancel: (projectID: string) => axios.post<void>(`${serviceEndpoint}/nlp/${projectID}/cancel`).then((res) => res.data),

  getApp: (projectID: string) => axios.get<void>(`${serviceEndpoint}/nlp/${projectID}`).then((res) => res.data),
});

export default createNLPService;
