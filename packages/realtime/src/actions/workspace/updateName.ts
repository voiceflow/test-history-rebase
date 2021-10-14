import { Context } from '@logux/server';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Action } from 'typescript-fsa';

import { AbstractWorkspaceChannelControl } from './utils';

class UpdateWorkspaceName extends AbstractWorkspaceChannelControl<Realtime.workspace.UpdateWorkspaceNamePayload> {
  protected actionCreator = Realtime.workspace.updateName;

  protected process = async (ctx: Context, { payload }: Action<Realtime.workspace.UpdateWorkspaceNamePayload>) => {
    await this.services.workspace.updateName(Number(ctx.userId), payload.workspaceID, payload.name);
  };
}

export default UpdateWorkspaceName;
