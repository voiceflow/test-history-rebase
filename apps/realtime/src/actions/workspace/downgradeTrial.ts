import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { AxiosError } from 'axios';
import { Action } from 'typescript-fsa';

import { AbstractWorkspaceChannelControl, WorkspaceContextData } from './utils';

export interface CheckoutContextData extends WorkspaceContextData {
  succedeed?: boolean;
}

class DowngradeWorkspaceTrial extends AbstractWorkspaceChannelControl<Realtime.workspace.DowngradeTrialPayload, CheckoutContextData> {
  protected actionCreator = Realtime.workspace.downgradeTrial.started;

  protected process = this.reply(Realtime.workspace.downgradeTrial, async (ctx, { payload }) => {
    try {
      await this.services.workspace.downgradeTrial(ctx.data.creatorID, payload.workspaceID);

      const [workspace, organizations] = await Promise.all([
        this.services.workspace.get(ctx.data.creatorID, payload.workspaceID).then(Realtime.Adapters.workspaceAdapter.fromDB),
        this.services.organization.getAll(ctx.data.creatorID).then(Realtime.Adapters.Identity.organization.mapFromDB),
      ]);

      await Promise.all([
        ctx.sendBack(Realtime.workspace.crud.update({ key: payload.workspaceID, value: workspace })),
        ctx.sendBack(Realtime.organization.crud.replace({ values: organizations })),
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

  protected finally = async (ctx: Context<CheckoutContextData>, { payload }: Action<Realtime.workspace.DowngradeTrialPayload>): Promise<void> => {
    if (!ctx.data.succedeed) return;

    const quotaName = Realtime.QuotaNames.TOKENS;

    await this.services.billing.changeQuotaPlan(ctx.data.creatorID, payload.workspaceID, quotaName);

    const quota = await this.services.billing.getQuotaByName(ctx.data.creatorID, payload.workspaceID, quotaName);

    if (!quota) return;

    await this.server.processAs(
      ctx.data.creatorID,
      Realtime.workspace.quotas.replaceQuota({ workspaceID: payload.workspaceID, quotaDetails: quota })
    );
  };
}

export default DowngradeWorkspaceTrial;
