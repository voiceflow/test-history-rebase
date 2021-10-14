import { Context } from '@logux/server';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Action } from 'typescript-fsa';

import { AbstractWorkspaceChannelControl } from '../utils';

class RemoveWorkspaceMember extends AbstractWorkspaceChannelControl<Realtime.workspace.member.BaseMemberPayload> {
  protected actionCreator = Realtime.workspace.member.remove;

  protected process = async (ctx: Context, { payload }: Action<Realtime.workspace.member.BaseMemberPayload>) => {
    const creatorID = Number(ctx.userId);
    const workspace = await this.services.workspace.get(creatorID, payload.workspaceID);

    await Promise.all([
      this.services.workspace.member.remove(creatorID, payload.workspaceID),
      this.server.process(Realtime.workspace.member.eject({ workspaceID: payload.workspaceID, workspaceName: workspace.name, creatorID })),
    ]);
  };
}

export default RemoveWorkspaceMember;
