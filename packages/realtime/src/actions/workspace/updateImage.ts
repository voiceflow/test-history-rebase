import { Context } from '@logux/server';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Action } from 'typescript-fsa';

import { AbstractWorkspaceChannelControl } from './utils';

class UpdateWorkspaceImage extends AbstractWorkspaceChannelControl<Realtime.workspace.UpdateWorkspaceImagePayload> {
  protected actionCreator = Realtime.workspace.updateImage;

  protected process = async (ctx: Context, { payload }: Action<Realtime.workspace.UpdateWorkspaceImagePayload>) => {
    await this.services.workspace.updateImage(Number(ctx.userId), payload.workspaceID, payload.image);
  };
}

export default UpdateWorkspaceImage;
