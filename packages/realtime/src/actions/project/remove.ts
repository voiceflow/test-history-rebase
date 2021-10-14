import type { Context } from '@logux/server';
import * as Realtime from '@voiceflow/realtime-sdk';
import type { Action } from 'typescript-fsa';

import { AbstractWorkspaceChannelControl } from '@/actions/workspace/utils';

type RemoveProjectPayload = Realtime.BaseWorkspacePayload & Realtime.actionUtils.CRUDKeyPayload;

class RemoveProject extends AbstractWorkspaceChannelControl<RemoveProjectPayload> {
  protected actionCreator = Realtime.project.crud.remove;

  protected process = async (ctx: Context, { payload }: Action<RemoveProjectPayload>): Promise<void> => {
    await this.services.project.delete(Number(ctx.userId), payload.key);
  };
}

export default RemoveProject;
