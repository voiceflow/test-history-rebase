import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context, terminateResend } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractProjectChannelControl } from '@/actions/project/utils';
import { WorkspaceContextData } from '@/actions/workspace/utils';

class UpdateCustomBlock extends AbstractProjectChannelControl<Realtime.customBlock.UpdatePayload> {
  protected actionCreator = Realtime.customBlock.update.started;

  protected resend = terminateResend;

  protected process = this.reply(Realtime.customBlock.update, async (ctx: Context, { payload }) => {
    const { creatorID } = ctx.data;
    const { workspaceID, projectID, versionID, id: blockID, ...apiPayload } = payload;

    const updatePatch = await this.services.customBlock.update(versionID, blockID, apiPayload);
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

  protected finally = async (ctx: Context<WorkspaceContextData>, { payload }: Action<Realtime.customBlock.UpdatePayload>): Promise<void> => {
    await this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID);
  };
}

export default UpdateCustomBlock;
