import * as Realtime from '@voiceflow/realtime-sdk';
import { terminateResend, unrestrictedAccess } from '@voiceflow/socket-utils';

import { AbstractActionControl } from '@/actions/utils';
import log from '@/logger';

class AcceptWorkspaceInvite extends AbstractActionControl<Realtime.workspace.member.AcceptInvitePayload> {
  protected actionCreator = Realtime.workspace.member.acceptInvite.started;

  protected access = unrestrictedAccess(this);

  protected resend = terminateResend;

  protected process = this.reply(Realtime.workspace.member.acceptInvite, async (ctx, { payload }) => {
    const { creatorID } = ctx.data;

    try {
      const workspaceID = await this.services.workspace.member.acceptInvite(creatorID, payload.invite);
      const workspace = await this.services.workspace.get(creatorID, workspaceID).then(Realtime.Adapters.workspaceAdapter.fromDB);

      // broadcast new workspace and updated member list
      await Promise.all([
        this.server.process(Realtime.workspace.crud.add({ key: workspaceID, value: workspace }), {
          channel: Realtime.Channels.creator.build({ creatorID: ctx.userId }),
        }),
        this.server.processAs(creatorID, Realtime.workspace.member.replace({ workspaceID, members: workspace.members })),
      ]);

      return workspaceID;
    } catch (error) {
      const { data } = error?.response ?? {};

      if (data?.data) {
        return this.reject(data?.data, data?.code === 409 ? Realtime.ErrorCode.ALREADY_MEMBER_OF_WORKSPACE : undefined);
      }

      log.error(error);
      throw error;
    }
  });
}

export default AcceptWorkspaceInvite;
