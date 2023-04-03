import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { terminateResend, unrestrictedAccess } from '@voiceflow/socket-utils';

import { AbstractActionControl } from '@/actions/utils';

class CreateWorkspace extends AbstractActionControl<Realtime.workspace.CreateWorkspacePayload> {
  protected actionCreator = Realtime.workspace.create.started;

  protected access = unrestrictedAccess(this);

  protected resend = terminateResend;

  protected process = this.reply(Realtime.workspace.create, async (ctx, action) => {
    const { creatorID } = ctx.data;
    const { team_id: workspaceID } = await this.services.workspace.create(creatorID, action.payload);

    const workspace = await this.services.workspace.get(creatorID, workspaceID).then(Realtime.Adapters.workspaceAdapter.fromDB);

    // only need to send this back to the initiating client
    await ctx.sendBack(Realtime.workspace.crud.add({ key: workspaceID, value: workspace }));

    return workspace;
  });
}

export default CreateWorkspace;
