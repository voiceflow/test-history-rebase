import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractNoopActionControl } from '@/actions/utils';

class EjectWorkspaceMember extends AbstractNoopActionControl<Realtime.workspace.member.EjectPayload> {
  protected actionCreator = Realtime.workspace.member.eject;

  protected resend = (_ctx: Context, { payload }: Action<Realtime.workspace.member.EjectPayload>) => ({
    user: String(payload.creatorID),
  });
}

export default EjectWorkspaceMember;
