import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractActionControl, terminateResend, unrestrictedAccess } from '@/actions/utils';

class CreateWorkspace extends AbstractActionControl<Realtime.workspace.CreateWorkspacePayload> {
  protected actionCreator = Realtime.workspace.create.started;

  protected access = unrestrictedAccess(this);

  protected resend = terminateResend;

  protected process = this.reply(Realtime.workspace.create, async (ctx, action) => {
    const { creatorID } = ctx.data;
    const workspace = await this.services.workspace.create(creatorID, action.payload.data);
    const workspaceID = workspace.team_id;

    const members = await this.services.workspace.member.getAll(creatorID, workspaceID);
    const workspaceWithMembers = Realtime.Adapters.workspaceWithMembersAdapter.fromDB({ workspace, members });

    // only need to send this back to the initiating client
    await ctx.sendBack(Realtime.workspace.crud.add({ key: workspaceID, value: workspaceWithMembers }));

    return workspaceWithMembers;
  });
}

export default CreateWorkspace;
