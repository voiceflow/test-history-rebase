import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractWorkspaceChannelControl } from '../utils';

class RemoveWorkspaceMember extends AbstractWorkspaceChannelControl<Realtime.workspace.member.BaseMemberPayload> {
  protected actionCreator = Realtime.workspace.member.remove;

  protected process = async (ctx: Context, { payload }: Action<Realtime.workspace.member.BaseMemberPayload>) => {
    const { creatorID } = ctx.data;
    const workspace = await this.services.workspace.get(creatorID, payload.workspaceID);

    await Promise.all([
      this.services.workspace.member.remove(creatorID, payload.workspaceID, payload.creatorID),
      this.server.process(
        Realtime.workspace.member.eject({ workspaceID: payload.workspaceID, workspaceName: workspace.name, creatorID: payload.creatorID })
      ),
    ]);
  };
}

export default RemoveWorkspaceMember;
