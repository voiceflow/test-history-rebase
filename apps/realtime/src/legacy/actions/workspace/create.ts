import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Actions } from '@voiceflow/sdk-logux-designer';
import { BaseContextData, Context, terminateResend, unrestrictedAccess } from '@voiceflow/socket-utils';

import { AbstractActionControl } from '@/legacy/actions/utils';

export interface WorkspaceCreationContextData extends BaseContextData {
  workspaceID?: string;
}

class CreateWorkspace extends AbstractActionControl<Realtime.workspace.CreateWorkspacePayload, WorkspaceCreationContextData> {
  protected actionCreator = Realtime.workspace.create.started;

  protected access = unrestrictedAccess(this);

  protected resend = terminateResend;

  protected process = this.reply(Realtime.workspace.create, async (ctx, action) => {
    const { creatorID } = ctx.data;
    const { team_id: workspaceID } = await this.services.workspace.create(creatorID, action.payload);

    const workspace = await this.services.workspace.get(workspaceID).then(Realtime.Adapters.workspaceAdapter.fromDB);

    // only need to send this back to the initiating client
    await ctx.sendBack(Realtime.workspace.crud.add({ key: workspaceID, value: workspace }));
    await ctx.sendBack(Actions.Organization.Replace({ data: await this.services.organization.getAll(creatorID) }));

    ctx.data.workspaceID = workspaceID;

    return workspace;
  });

  protected finally = async (ctx: Context<WorkspaceCreationContextData>): Promise<void> => {
    const { workspaceID } = ctx.data;
    if (!workspaceID) return;

    const quotaName = Realtime.QuotaNames.TOKENS;

    await this.services.billing.changeQuotaPlan(ctx.data.creatorID, workspaceID, quotaName);

    const quota = await this.services.billing.getQuotaByName(ctx.data.creatorID, workspaceID, quotaName);

    if (!quota) return;

    await this.server.processAs(ctx.data.creatorID, ctx.data.clientID, Realtime.workspace.quotas.replaceQuota({ workspaceID, quotaDetails: quota }));
  };
}

export default CreateWorkspace;
