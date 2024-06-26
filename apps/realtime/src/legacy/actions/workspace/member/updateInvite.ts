import * as Realtime from '@voiceflow/realtime-sdk/backend';
import type { Context } from '@voiceflow/socket-utils';
import type { Action } from 'typescript-fsa';

import { AbstractWorkspaceChannelControl } from '../utils';

class UpdateWorkspaceInvite extends AbstractWorkspaceChannelControl<Realtime.workspace.member.UpdateInvitePayload> {
  protected actionCreator = Realtime.workspace.member.updateInvite;

  protected process = async (ctx: Context, { payload }: Action<Realtime.workspace.member.UpdateInvitePayload>) => {
    await this.services.workspace.member.updateInvite(
      ctx.data.creatorID,
      payload.workspaceID,
      payload.email,
      payload.role
    );
  };
}

export default UpdateWorkspaceInvite;
