import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context, terminateResend } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractProjectChannelControl } from '@/actions/project/utils';
import { WorkspaceContextData } from '@/actions/workspace/utils';

class CreateCustomBlock extends AbstractProjectChannelControl<Realtime.customBlock.CreatePayload> {
  protected actionCreator = Realtime.customBlock.create.started;

  protected resend = terminateResend;

  protected process = this.reply(Realtime.customBlock.create, async (ctx: Context, { payload }) => {
    const { creatorID } = ctx.data;
    const { workspaceID, versionID, ...apiPayload } = payload;

    const newCustomBlock = await this.services.customBlock.create(creatorID, apiPayload.projectID, apiPayload);

    await this.server.processAs(
      creatorID,
      Realtime.customBlock.crud.add({
        key: newCustomBlock.id,
        value: newCustomBlock,
        projectID: newCustomBlock.projectID,
        workspaceID,
        versionID,
      })
    );

    return newCustomBlock;
  });

  protected finally = async (ctx: Context<WorkspaceContextData>, { payload }: Action<Realtime.customBlock.CreatePayload>): Promise<void> => {
    await this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID);
  };
}

export default CreateCustomBlock;
