import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { terminateResend } from '@voiceflow/socket-utils';

import { AbstractWorkspaceChannelControl } from '../utils';

class SendWorkspaceInvite extends AbstractWorkspaceChannelControl<Realtime.workspace.member.SendInvitePayload> {
  protected actionCreator = Realtime.workspace.member.sendInvite.started;

  protected resend = terminateResend;

  process = this.reply(Realtime.workspace.member.sendInvite, async (ctx, { payload }) => {
    const { creatorID, clientID } = ctx.data;

    const newMember = await this.services.workspace.member.sendInvite(creatorID, payload.workspaceID, payload.email, payload.role);

    if (newMember) {
      await this.server.processAs(creatorID, clientID, Realtime.workspace.member.add({ member: newMember, workspaceID: payload.workspaceID }));
    } else {
      await this.server.processAs(
        creatorID,
        clientID,
        Realtime.workspace.member.renewInvite({ workspaceID: payload.workspaceID, email: payload.email, role: payload.role })
      );
    }

    return newMember;
  });
}

export default SendWorkspaceInvite;
