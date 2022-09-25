import * as Realtime from '@voiceflow/realtime-sdk';
import { Context, terminateResend } from '@voiceflow/socket-utils';

import { AbstractProjectChannelControl } from '@/actions/project/utils';

class UpdateCustomBlock extends AbstractProjectChannelControl<Realtime.customBlock.UpdatePayload> {
  protected actionCreator = Realtime.customBlock.update.started;

  protected resend = terminateResend;

  protected process = this.reply(Realtime.customBlock.update, async (ctx: Context, { payload }) => {
    const { creatorID } = ctx.data;
    const { workspaceID, projectID, versionID, id: blockID, ...apiPayload } = payload;

    const updatePatch = await this.services.customBlock.update(creatorID, projectID, blockID, apiPayload);
    const newCustomBlock = { ...updatePatch, id: blockID };

    await this.server.processAs(
      creatorID,
      Realtime.customBlock.crud.update({
        key: blockID,
        value: newCustomBlock,
        projectID,
        workspaceID,
        versionID,
      })
    );

    return newCustomBlock;
  });
}

export default UpdateCustomBlock;
