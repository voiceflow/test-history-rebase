import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractActionControl, terminateResend, unrestrictedAccess } from '@/actions/utils';

class CreateWorkspace extends AbstractActionControl<Realtime.workspace.CreateWorkspacePayload> {
  protected actionCreator = Realtime.workspace.create.started;

  protected access = unrestrictedAccess.bind(this);

  protected resend = terminateResend;

  protected process = this.reply(Realtime.workspace.create, async (ctx, action) => {
    const workspace = await this.services.workspace.create(Number(ctx.userId), action.payload.data).then(Realtime.Adapters.workspaceAdapter.fromDB);

    // only need to send this back to the initiating client
    await ctx.sendBack(Realtime.workspace.crud.add({ key: workspace.id, value: workspace }));

    return workspace;
  });
}

export default CreateWorkspace;
