import { BillingPeriod } from '@voiceflow/internal';

import { NestResource, NestResourceOptions } from '../nest';

export interface CheckoutPayload {
  seats: number;
  period: BillingPeriod;
  sourceID: string;
}

export class Workspace extends NestResource {
  constructor(options: NestResourceOptions) {
    super({ ...options, path: '/workspace' });
  }

  public async checkout(workspaceID: string, payload: CheckoutPayload): Promise<void> {
    await this.post(`/${workspaceID}/checkout`, payload);
  }
}
