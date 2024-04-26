import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Actions } from '@voiceflow/sdk-logux-designer';
import type { Context } from '@voiceflow/socket-utils';
import { AxiosError } from 'axios';
import type { Action } from 'typescript-fsa';

import type { WorkspaceContextData } from './utils';
import { AbstractWorkspaceChannelControl } from './utils';

export interface CheckoutContextData extends WorkspaceContextData {
  succedeed?: boolean;
}

class DowngradeWorkspaceTrial extends AbstractWorkspaceChannelControl<
  Realtime.workspace.DowngradeTrialPayload,
  CheckoutContextData
> {
  protected actionCreator = Realtime.workspace.downgradeTrial.started;

  protected process = this.reply(Realtime.workspace.downgradeTrial, async (ctx, { payload }) => {
    try {
      await this.services.workspace.downgradeTrial(ctx.data.creatorID, payload.workspaceID);

      const [workspace, organizations] = await Promise.all([
        this.services.workspace.get(payload.workspaceID).then(Realtime.Adapters.workspaceAdapter.fromDB),
        this.services.organization.getAll(Number(ctx.userId)),
      ]);

      await Promise.all([
        ctx.sendBack(Realtime.workspace.crud.update({ key: payload.workspaceID, value: workspace })),
        ctx.sendBack(Actions.Organization.Replace({ data: organizations })),
      ]);

      ctx.data.succedeed = true;
      return null;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 400) {
        return this.reject(error.response.data.data, Realtime.ErrorCode.CHECKOUT_FAILED);
      }
      this.log.error(error);
      throw error;
    }
  });

  protected finally = async (
    ctx: Context<CheckoutContextData>,
    { payload }: Action<Realtime.workspace.DowngradeTrialPayload>
  ): Promise<void> => {
    if (!ctx.data.succedeed) return;

    const quotaName = Realtime.QuotaNames.TOKENS;

    await this.services.billing.changeQuotaPlan(ctx.data.creatorID, payload.workspaceID, quotaName);

    const quota = await this.services.billing.getQuotaByName(ctx.data.creatorID, payload.workspaceID, quotaName);

    if (!quota) return;

    await this.server.processAs(
      ctx.data.creatorID,
      ctx.data.clientID,
      Realtime.workspace.quotas.replaceQuota({ workspaceID: payload.workspaceID, quotaDetails: quota })
    );
  };
}

export default DowngradeWorkspaceTrial;
