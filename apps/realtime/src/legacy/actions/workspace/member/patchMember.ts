import * as Realtime from '@voiceflow/realtime-sdk/backend';
import type { Context } from '@voiceflow/socket-utils';
import type { Action } from 'typescript-fsa';

import { AbstractWorkspaceChannelControl } from '../utils';

class PatchWorkspaceMember extends AbstractWorkspaceChannelControl<Realtime.workspace.member.PatchMemberPayload> {
  protected actionCreator = Realtime.workspace.member.patch;

  protected process = async (ctx: Context, { payload }: Action<Realtime.workspace.member.PatchMemberPayload>) => {
    const { creatorID } = ctx.data;

    await this.services.workspace.member.patch(creatorID, payload.workspaceID, payload.creatorID, {
      role: payload.member.role,
    });
  };
}

export default PatchWorkspaceMember;
