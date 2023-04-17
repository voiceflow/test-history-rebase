import { Nullable } from '@voiceflow/common';
import { fetchLogger, NetworkError } from '@voiceflow/ui';
import axios from 'axios';

export const RESOURCE_ENDPOINT = 'session';

const createSessionService = <A extends Record<string, any>, D extends Record<string, any>>(serviceEndpoint: string) => ({
  getAccount: () =>
    axios
      .get<Nullable<A>>(`${serviceEndpoint}/${RESOURCE_ENDPOINT}/profile`)
      .then((res) => res.data)
      .catch((err: NetworkError<unknown>) => {
        if (err.statusCode === 500) {
          fetchLogger.warn('no active profile found');
          return null;
        }

        throw err;
      }),

  linkAccount: (data: D) => axios.post<A>(`${serviceEndpoint}/${RESOURCE_ENDPOINT}`, data).then((res) => res.data),

  unlinkAccount: () => axios.delete<void>(`${serviceEndpoint}/${RESOURCE_ENDPOINT}`).then((res) => res.data),
});

export default createSessionService;
