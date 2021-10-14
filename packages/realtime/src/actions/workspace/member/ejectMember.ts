import { Context } from '@logux/server';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Action } from 'typescript-fsa';

import { AbstractWorkspaceChannelControl, WorkspaceContextData } from '../utils';

class EjectWorkspaceMember extends AbstractWorkspaceChannelControl<Realtime.workspace.member.EjectPayload> {
  protected actionCreator = Realtime.workspace.member.eject;

  protected resend = (_ctx: Context<WorkspaceContextData>, { payload }: Action<Realtime.workspace.member.EjectPayload>) => ({
    user: String(payload.creatorID),
  });

  protected process = Realtime.Utils.functional.noop;
}

export default EjectWorkspaceMember;
