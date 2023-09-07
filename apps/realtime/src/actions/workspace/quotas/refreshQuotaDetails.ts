import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractWorkspaceChannelControl } from '../utils';

class RefreshQuotaDetails extends AbstractWorkspaceChannelControl<Realtime.workspace.quotas.RefreshQuotaDetailsPayload> {
  protected actionCreator = Realtime.workspace.quotas.refreshQuotaDetails;

  process = async (ctx: Context, { payload }: Action<Realtime.workspace.quotas.RefreshQuotaDetailsPayload>) => {
    const { workspaceID, quotaName } = payload;

    const quotaDetails = await this.services.billing.getQuotaByName(ctx.data.creatorID, workspaceID, quotaName);

    if (!quotaDetails) return;

    await this.server.processAs(ctx.data.creatorID, Realtime.workspace.quotas.replaceQuota({ workspaceID, quotaDetails }));
  };
}

export default RefreshQuotaDetails;
