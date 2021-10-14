import * as Realtime from '@voiceflow/realtime-sdk';

import { terminateResend } from '@/actions/utils';

import { AbstractWorkspaceChannelControl } from '../utils';

class SendWorkspaceInvite extends AbstractWorkspaceChannelControl<Realtime.workspace.member.SendInvitePayload> {
  protected actionCreator = Realtime.workspace.member.sendInvite.started;

  protected resend = terminateResend;

  process = this.reply(Realtime.workspace.member.sendInvite, async (ctx, { payload }) => {
    const newMember = await this.services.workspace.member.sendInvite(Number(ctx.userId), payload.workspaceID, payload.email, payload.role);

    if (newMember) {
      await this.server.process(
        Realtime.workspace.member.add({ workspaceID: payload.workspaceID, creatorID: newMember.creator_id, member: newMember })
      );
    }

    return newMember;
  });
}

export default SendWorkspaceInvite;
