import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractActionControl, terminateResend, unrestrictedAccess } from '@/actions/utils';

class AcceptWorkspaceInvite extends AbstractActionControl<Realtime.workspace.member.AcceptInvitePayload> {
  protected actionCreator = Realtime.workspace.member.acceptInvite.started;

  protected access = unrestrictedAccess.bind(this);

  protected resend = terminateResend;

  protected process = this.reply(Realtime.workspace.member.acceptInvite, async (ctx, { payload }) => {
    const creatorID = Number(ctx.userId);

    const workspaceID = await this.services.workspace.member.acceptInvite(creatorID, payload.invite);

    // broadcast updated member list
    const members = await this.services.workspace.member.getAll(creatorID, workspaceID);
    await this.server.process(Realtime.workspace.member.replace({ workspaceID, members }));

    return workspaceID;
  });
}

export default AcceptWorkspaceInvite;
