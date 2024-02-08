import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractWorkspaceChannelControl, WorkspaceContextData } from './utils';

export interface CheckoutContextData extends WorkspaceContextData {
  checkoutSuccedeed?: boolean;
}

class CheckoutWorkspace extends AbstractWorkspaceChannelControl<Realtime.workspace.CheckoutPayload, CheckoutContextData> {
  protected actionCreator = Realtime.workspace.checkout.started;

  protected process = this.reply(Realtime.workspace.checkout, async (ctx, { payload }) => {
    try {
      await this.services.workspace.checkout(ctx.data.creatorID, payload);

      const [workspace, organizations] = await Promise.all([
        this.services.workspace.get(payload.workspaceID).then(Realtime.Adapters.workspaceAdapter.fromDB),
        this.services.organization.getAll().then(Realtime.Adapters.Identity.organization.mapFromDB),
      ]);

      await Promise.all([
        ctx.sendBack(Realtime.workspace.crud.update({ key: payload.workspaceID, value: workspace })),
        ctx.sendBack(Realtime.organization.crud.replace({ values: organizations })),
      ]);

      ctx.data.checkoutSuccedeed = true;
      return null;
    } catch (error) {
      if ((error as any).statusCode === 402) {
        return this.reject((error as any).message, Realtime.ErrorCode.CHECKOUT_FAILED);
      }
      this.log.error(error);
      throw error;
    }
  });

  protected finally = async (ctx: Context<CheckoutContextData>, { payload }: Action<Realtime.workspace.CheckoutPayload>): Promise<void> => {
    if (!ctx.data.checkoutSuccedeed) return;

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

export default CheckoutWorkspace;
