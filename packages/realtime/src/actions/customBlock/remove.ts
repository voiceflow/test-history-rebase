import * as Realtime from '@voiceflow/realtime-sdk';
import { Context, terminateResend } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractProjectChannelControl } from '@/actions/project/utils';

class RemoveCustomBlock extends AbstractProjectChannelControl<Realtime.customBlock.RemovePayload> {
  protected actionCreator = Realtime.customBlock.remove;

  protected resend = terminateResend;

  protected process = async (ctx: Context, { payload }: Action<Realtime.customBlock.RemovePayload>) => {
    const { creatorID } = ctx.data;
    const { workspaceID, versionID, projectID, id: blockID } = payload;

    await this.services.customBlock.delete(creatorID, projectID, blockID);

    await this.server.processAs(
      creatorID,
      Realtime.customBlock.crud.remove({
        key: blockID,
        projectID,
        workspaceID,
        versionID,
      })
    );
  };
}

export default RemoveCustomBlock;
