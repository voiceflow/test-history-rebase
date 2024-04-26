import type { BillingPeriod } from '@voiceflow/internal';

import type { NestResourceOptions } from '../nest';
import { NestResource } from '../nest';

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
