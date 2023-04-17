import { AI_GENERATION_QUOTA } from '@/constants';

import { AbstractControl } from '../control';

class BillingService extends AbstractControl {
  async consumeGenerationQuota(workspaceID: string, consumed: number) {
    // Call billing service
    return this.clients.billing.consumeQuota(workspaceID, AI_GENERATION_QUOTA, consumed);
  }
}

export default BillingService;
