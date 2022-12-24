import { AxiosInstance } from 'axios';

import { Options } from './types';

class Billing {
  private api: AxiosInstance;

  private BILLING_API_VERSION = 'v1';

  constructor({ axios, config }: Options) {
    this.api = axios.create({
      baseURL: config.BILLING_API_ENDPOINT,
      validateStatus: (status) => (status >= 200 && status < 300) || status === 403, // normal status & forbidden
    });
  }

  async consumeQuota(workspaceID: string, quotaName: string, consumed: number) {
    const billingURL = `${this.BILLING_API_VERSION}/private/quota/workspace/${workspaceID}/${encodeURIComponent(quotaName)}/consume/${consumed}`;
    return this.api.post(billingURL);
  }
}

export default Billing;
