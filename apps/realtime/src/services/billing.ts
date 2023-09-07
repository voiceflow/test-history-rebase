import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractControl } from '@/control';

class BillingService extends AbstractControl {
  public async deleteWorkspaceQuotas(creatorID: number, workspaceID: string) {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    return client.billing.quota.deleteWorkspaceQuotas(workspaceID);
  }

  public async getWorkspaceQuotas(creatorID: number, workspaceID: string): Promise<Realtime.Quota[]> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    try {
      return client.billing.quota.getWorkspaceQuotas(workspaceID);
    } catch (err) {
      return [];
    }
  }

  public async getQuotaByName(creatorID: number, workspaceID: string, quotaName: string): Promise<Realtime.Quota | null> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);
    return client.billing.quota.getQuotaByName(workspaceID, quotaName);
  }

  public async changeQuotaPlan(creatorID: number, workspaceID: string, quotaName: Realtime.QuotaNames): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    return client.billing.privateQuota.updateQuotaPlan(workspaceID, quotaName);
  }
}

export default BillingService;
