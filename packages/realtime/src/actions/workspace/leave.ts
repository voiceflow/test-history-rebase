import { Context, ServerMeta } from '@logux/server';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Action } from 'typescript-fsa';

import { AbstractWorkspaceChannelControl, WorkspaceContextData } from './utils';

class LeaveWorkspace extends AbstractWorkspaceChannelControl<Realtime.workspace.LeaveWorkspacePayload> {
  protected actionCreator = Realtime.workspace.leave;

  protected access = async (ctx: Context<WorkspaceContextData>, action: Action<Realtime.workspace.LeaveWorkspacePayload>, meta: ServerMeta) => {
    const hasResourceAccess = await super.access(ctx, action, meta);

    return hasResourceAccess && action.payload.creatorID === Number(ctx.userId);
  };

  protected process = async (ctx: Context, { payload }: Action<Realtime.workspace.LeaveWorkspacePayload>) => {
    await Promise.all([
      this.services.workspace.member.removeSelf(Number(ctx.userId), payload.workspaceID),
      ctx.sendBack(Realtime.workspace.crud.remove({ key: payload.workspaceID })),
    ]);
  };
}

export default LeaveWorkspace;
