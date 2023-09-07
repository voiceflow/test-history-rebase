import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractWorkspaceChannelControl } from '../utils';

class UpdateWorkspaceInvite extends AbstractWorkspaceChannelControl<Realtime.workspace.member.UpdateInvitePayload> {
  protected actionCreator = Realtime.workspace.member.updateInvite;

  protected process = async (ctx: Context, { payload }: Action<Realtime.workspace.member.UpdateInvitePayload>) => {
    await this.services.workspace.member.updateInvite(ctx.data.creatorID, payload.workspaceID, payload.email, payload.role);
  };
}

export default UpdateWorkspaceInvite;
