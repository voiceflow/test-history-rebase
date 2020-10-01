import axios from 'axios';

import { Nullable } from '@/types';

export const RESOURCE_ENDPOINT = 'session';

const createSessionService = <A extends Record<string, any>, D extends Record<string, any>>(serviceEndpoint: string) => ({
  getAccount: () => axios.get<Nullable<A>>(`${serviceEndpoint}/${RESOURCE_ENDPOINT}/profile`).then((res) => res.data),

  linkAccount: (data: D) => axios.post<A>(`${serviceEndpoint}/${RESOURCE_ENDPOINT}`, data).then((res) => res.data),

  unlinkAccount: () => axios.delete<void>(`${serviceEndpoint}/${RESOURCE_ENDPOINT}`).then((res) => res.data),
});

export default createSessionService;
