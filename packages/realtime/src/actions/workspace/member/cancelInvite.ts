import { Context } from '@logux/server';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Action } from 'typescript-fsa';

import { AbstractWorkspaceChannelControl } from '../utils';

class CancelWorkspaceInvite extends AbstractWorkspaceChannelControl<Realtime.workspace.member.BaseInvitePayload> {
  protected actionCreator = Realtime.workspace.member.cancelInvite;

  protected process = async (ctx: Context, { payload }: Action<Realtime.workspace.member.BaseInvitePayload>) => {
    await this.services.workspace.member.cancelInvite(Number(ctx.userId), payload.workspaceID, payload.email);
  };
}

export default CancelWorkspaceInvite;
