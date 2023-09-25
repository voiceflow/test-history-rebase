import axios from 'axios';

import { BILLING_API_CLOUD_ENDPOINT } from '@/config';

import { AUTH_HEADERS } from './constant';

interface Options {
  redirectURL: string;
  quantity: string;
}

export const createChargebeeTokenURLEndpoint =
  (workspaceID: string) =>
  ({ redirectURL, quantity }: Options): Promise<string> =>
    axios
      .get<string>(
        `${BILLING_API_CLOUD_ENDPOINT}/v1alpha1/portal/customer/ws-${workspaceID}/checkout/charge?item=llm-credit-v1-USD&quantity=${quantity}&redirect_url=${redirectURL}`,
        { headers: AUTH_HEADERS }
      )
      .then((response) => response.data);
