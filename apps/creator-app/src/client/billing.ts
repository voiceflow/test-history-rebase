import axios from 'axios';

import { BILLING_API_CLOUD_ENDPOINT } from '@/config';

import { AUTH_HEADERS } from './constant';

interface Options {
  redirectURL: string;
  quantity: string;
}

export const createChargebeeTokenURLEndpoint =
  (workspaceID: string, chargebeeCustomerID?: string) =>
  ({ redirectURL, quantity }: Options): Promise<string> =>
    axios
      .get<string>(
        // don't include ws- prefix if subscriptionID is provided. ws- prefix means it's a legacy customer
        `${BILLING_API_CLOUD_ENDPOINT}/v1alpha1/portal/customer/${chargebeeCustomerID ? '' : 'ws-'}${
          chargebeeCustomerID ?? workspaceID
        }/checkout/charge?item=llm-credit-v1-USD&quantity=${quantity}&redirect_url=${redirectURL}`,
        { headers: AUTH_HEADERS }
      )
      .then((response) => response.data);
