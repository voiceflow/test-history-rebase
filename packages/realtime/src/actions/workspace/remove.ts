import * as Realtime from '@voiceflow/realtime-sdk';
import { Action } from 'typescript-fsa';

import { Context } from '@/types';

import { AbstractWorkspaceChannelControl } from './utils';

type RemoveWorkspacePayload = Realtime.BaseCreatorPayload & Realtime.actionUtils.CRUDKeyPayload;

class RemoveWorkspace extends AbstractWorkspaceChannelControl<RemoveWorkspacePayload> {
  protected actionCreator = Realtime.workspace.crud.remove;

  protected process = async (ctx: Context, { payload }: Action<RemoveWorkspacePayload>) => {
    await this.services.workspace.delete(ctx.data.creatorID, payload.key);
  };
}

export default RemoveWorkspace;
