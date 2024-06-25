import * as Realtime from '@voiceflow/realtime-sdk/backend';
import type { Context } from '@voiceflow/socket-utils';
import type { Action } from 'typescript-fsa';

import { AbstractNoopActionControl } from '@/legacy/actions/utils';

class EjectWorkspaceMember extends AbstractNoopActionControl<Realtime.workspace.member.EjectPayload> {
  protected actionCreator = Realtime.workspace.member.eject;

  protected resend = (_ctx: Context, { payload }: Action<Realtime.workspace.member.EjectPayload>) => ({
    user: String(payload.creatorID),
  });
}

export default EjectWorkspaceMember;
