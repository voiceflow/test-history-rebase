import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractWorkspaceChannelControl } from './utils';

class UpdateWorkspaceName extends AbstractWorkspaceChannelControl<Realtime.workspace.UpdateWorkspaceNamePayload> {
  protected actionCreator = Realtime.workspace.updateName;

  protected process = async (ctx: Context, { payload }: Action<Realtime.workspace.UpdateWorkspaceNamePayload>) => {
    await this.services.workspace.updateName(ctx.data.creatorID, payload.workspaceID, payload.name);
  };
}

export default UpdateWorkspaceName;
