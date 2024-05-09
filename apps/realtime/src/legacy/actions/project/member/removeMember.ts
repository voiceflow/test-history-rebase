import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractProjectResourceControl } from '../utils';

class RemoveWorkspaceMember extends AbstractProjectResourceControl<Realtime.project.member.BaseMemberPayload> {
  protected actionCreator = Realtime.project.member.remove;

  protected process = async (ctx: Context, { payload }: Action<Realtime.project.member.BaseMemberPayload>) => {
    const { creatorID } = ctx.data;

    await this.services.project.member.remove(creatorID, payload.projectID, payload.creatorID);
    await this.services.organization.getTakenSeatsAndBroadcastFromWorkspaceID(payload.workspaceID, {
      userID: creatorID,
      clientID: ctx.clientId,
    });
  };
}

export default RemoveWorkspaceMember;
