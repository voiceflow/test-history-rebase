import { Inject, Injectable, Logger } from '@nestjs/common';
import * as Realtime from '@voiceflow/realtime-sdk/backend';

import { LegacyService } from '@/legacy/legacy.service';

/* @Deprecated We can kill this once everyone is on chargebee */
@Injectable()
export class WorkspaceBillingService {
  private readonly logger = new Logger(WorkspaceBillingService.name);

  constructor(@Inject(LegacyService) private readonly legacy: LegacyService) {}

  /* @Deprecated with chargebee, checkout belongs to organization domain */
  public async checkout(
    creatorID: number,
    { workspaceID, ...data }: Realtime.workspace.CheckoutPayload
  ): Promise<void> {
    const client = await this.legacy.services.voiceflow.client.getByUserID(creatorID);

    return client.billing.workspace.checkout(workspaceID, data);
  }

  /* @Deprecated with chargebee, changeSeats belongs to organization domain */
  public async changeSeats(
    creatorID: number,
    workspaceID: string,
    data: { seats: number; schedule?: boolean }
  ): Promise<void> {
    const client = await this.legacy.services.voiceflow.client.getByUserID(creatorID);

    return client.workspace.changeSeats(workspaceID, data);
  }

  /* @Deprecated with chargebee, downgradeTrial belongs to organization domain */
  public async downgradeTrial(creatorID: number, workspaceID: string): Promise<void> {
    const client = await this.legacy.services.voiceflow.client.getByUserID(creatorID);

    await client.billing.privateWorkspace.downgradeTrial(workspaceID);
  }

  /* @Deprecated with chargebee, deleting subscription belongs to organization domain */
  public async deleteWorkspaceSubscription(creatorID: number, workspaceID: string) {
    const client = await this.legacy.services.voiceflow.client.getByUserID(creatorID);

    await client.workspace
      .deleteStripeSubscription(workspaceID)
      .catch((error) => this.logger.warn(error, '[deleteWorkspaceSubscription] delete stripe subscription error'));

    // TODO: move to identity when creator-api gets phased out
    await this.legacy.services.billing
      .deleteWorkspaceQuotas(creatorID, workspaceID)
      .catch((error) => this.logger.warn(error, '[deleteWorkspaceSubscription] delete workspace quotas error'));
  }

  /* Quotas */

  public async deleteWorkspaceQuotas(creatorID: number, workspaceID: string) {
    const client = await this.legacy.services.voiceflow.client.getByUserID(creatorID);

    return client.billing.quota.deleteWorkspaceQuotas(workspaceID);
  }

  public async getWorkspaceQuotas(creatorID: number, workspaceID: string): Promise<Realtime.Quota[]> {
    const client = await this.legacy.services.voiceflow.client.getByUserID(creatorID);

    try {
      return client.billing.quota.getWorkspaceQuotas(workspaceID);
    } catch (err) {
      return [];
    }
  }

  public async getQuotaByName(
    creatorID: number,
    workspaceID: string,
    quotaName: string
  ): Promise<Realtime.Quota | null> {
    const client = await this.legacy.services.voiceflow.client.getByUserID(creatorID);

    return client.billing.quota.getQuotaByName(workspaceID, quotaName);
  }

  public async changeQuotaPlan(creatorID: number, workspaceID: string, quotaName: Realtime.QuotaNames) {
    const client = await this.legacy.services.voiceflow.client.getByUserID(creatorID);

    await client.billing.privateQuota.updateQuotaPlan(workspaceID, quotaName);

    return this.getQuotaByName(creatorID, workspaceID, quotaName);
  }
}
