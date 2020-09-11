import axios from 'axios';

import { ALEXA_SERVICE_ENDPOINT } from '@/config';
import { Account } from '@/models';
import { Nullable } from '@/types';

const RESOURCE_ENDPOINT = 'session';

const sessionAlexaService = {
  getAmazonAccount: () => axios.get<Nullable<Account.Amazon>>(`${ALEXA_SERVICE_ENDPOINT}/${RESOURCE_ENDPOINT}/profile`).then((res) => res.data),

  linkAmazonAccount: (code: string) =>
    axios
      .post<Account.Amazon>(`${ALEXA_SERVICE_ENDPOINT}/${RESOURCE_ENDPOINT}`, { code })
      .then((res) => res.data),

  unlinkAmazonAccount: () => axios.delete<void>(`${ALEXA_SERVICE_ENDPOINT}/${RESOURCE_ENDPOINT}`).then((res) => res.data),
};

export default sessionAlexaService;
