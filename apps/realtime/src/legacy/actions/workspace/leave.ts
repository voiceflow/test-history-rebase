import type { ServerMeta } from '@logux/server';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import type { Context } from '@voiceflow/socket-utils';
import type { Action } from 'typescript-fsa';

import type { WorkspaceContextData } from './utils';
import { AbstractWorkspaceChannelControl, accessWorkspaces } from './utils';

class LeaveWorkspace extends AbstractWorkspaceChannelControl<Realtime.workspace.LeaveWorkspacePayload> {
  protected actionCreator = Realtime.workspace.leave;

  protected access = async (
    ctx: Context<WorkspaceContextData>,
    action: Action<Realtime.workspace.LeaveWorkspacePayload>,
    meta: ServerMeta
  ): Promise<boolean> => {
    const hasResourceAccess = await accessWorkspaces(this)(ctx, action, meta);

    return hasResourceAccess && action.payload.creatorID === ctx.data.creatorID;
  };

  protected process = async (ctx: Context, { payload }: Action<Realtime.workspace.LeaveWorkspacePayload>) => {
    await Promise.all([
      this.services.workspace.member.removeSelf(ctx.data.creatorID, payload.workspaceID),
      ctx.sendBack(Realtime.workspace.crud.remove({ key: payload.workspaceID })),
    ]);
  };
}

export default LeaveWorkspace;
