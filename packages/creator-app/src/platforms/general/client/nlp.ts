import { Nullable } from '@voiceflow/common';
import axios from 'axios';

import { VersionTag } from '@/constants/platforms';
import { NLPTrainJob } from '@/models';

const createNLPService = (serviceEndpoint: string) => ({
  run: (projectID: string, { tag = VersionTag.DEVELOPMENT, versionName = '' }: { tag?: VersionTag; versionName?: string } = {}) =>
    axios
      .post<{ job: NLPTrainJob.AnyJob; appID: string; projectID: string }>(`${serviceEndpoint}/nlp/${projectID}/publish`, {
        tag,
        versionName,
      })
      .then((res) => res.data),

  getStatus: (projectID: string, { tag = VersionTag.DEVELOPMENT }: { tag?: VersionTag } = {}) =>
    axios.get<Nullable<NLPTrainJob.AnyJob>>(`${serviceEndpoint}/nlp/${projectID}/status?tag=${tag}`).then((res) => res.data),

  cancel: (projectID: string, { tag = VersionTag.DEVELOPMENT }: { tag?: VersionTag } = {}) =>
    axios.post<void>(`${serviceEndpoint}/nlp/${projectID}/cancel`, { tag }).then((res) => res.data),

  getApp: (projectID: string) => axios.get<void>(`${serviceEndpoint}/nlp/${projectID}`).then((res) => res.data),
});

export default createNLPService;
