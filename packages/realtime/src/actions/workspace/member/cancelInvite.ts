import * as Realtime from '@voiceflow/realtime-sdk';
import { Action } from 'typescript-fsa';

import { Context } from '@/types';

import { AbstractWorkspaceChannelControl } from '../utils';

class CancelWorkspaceInvite extends AbstractWorkspaceChannelControl<Realtime.workspace.member.BaseInvitePayload> {
  protected actionCreator = Realtime.workspace.member.cancelInvite;

  protected process = async (ctx: Context, { payload }: Action<Realtime.workspace.member.BaseInvitePayload>) => {
    await this.services.workspace.member.cancelInvite(ctx.data.creatorID, payload.workspaceID, payload.email);
  };
}

export default CancelWorkspaceInvite;
