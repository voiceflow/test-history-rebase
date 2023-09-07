import * as Realtime from '@voiceflow/realtime-sdk';
import { terminateResend, unrestrictedAccess } from '@voiceflow/socket-utils';
import { AxiosError } from 'axios';

import { AbstractActionControl } from '@/actions/utils';

class AcceptWorkspaceInvite extends AbstractActionControl<Realtime.workspace.member.AcceptInvitePayload> {
  protected actionCreator = Realtime.workspace.member.acceptInvite.started;

  protected access = unrestrictedAccess(this);

  protected resend = terminateResend;

  protected process = this.reply(Realtime.workspace.member.acceptInvite, async (ctx, { payload }) => {
    const { creatorID } = ctx.data;

    try {
      const workspaceID = await this.services.workspace.member.acceptInvite(creatorID, payload.invite);
      const dbWorkspace = await this.services.workspace.get(creatorID, workspaceID);
      const workspace = Realtime.Adapters.workspaceAdapter.fromDB(dbWorkspace);

      // broadcast new workspace and updated member list
      await Promise.all([
        this.server.process(Realtime.workspace.crud.add({ key: workspaceID, value: workspace }), {
          channel: Realtime.Channels.creator.build({ creatorID: ctx.userId }),
        }),

        this.server.processAs(creatorID, Realtime.workspace.member.replace({ members: dbWorkspace.members, workspaceID })),
      ]);

      return workspaceID;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 409) {
        return this.reject(error.response.data, Realtime.ErrorCode.ALREADY_MEMBER_OF_WORKSPACE);
      }

      this.log.error(error);
      throw error;
    }
  });
}

export default AcceptWorkspaceInvite;
