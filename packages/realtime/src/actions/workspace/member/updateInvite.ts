import { Context } from '@logux/server';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Action } from 'typescript-fsa';

import { AbstractWorkspaceChannelControl } from '../utils';

class UpdateWorkspaceInvite extends AbstractWorkspaceChannelControl<Realtime.workspace.member.UpdateInvitePayload> {
  protected actionCreator = Realtime.workspace.member.updateInvite;

  protected process = async (ctx: Context, { payload }: Action<Realtime.workspace.member.UpdateInvitePayload>) => {
    await this.services.workspace.member.updateInvite(Number(ctx.userId), payload.workspaceID, payload.email, payload.role);
  };
}

export default UpdateWorkspaceInvite;
