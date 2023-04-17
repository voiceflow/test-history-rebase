import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context, terminateResend } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractProjectChannelControl } from '@/actions/project/utils';
import { WorkspaceContextData } from '@/actions/workspace/utils';

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

  protected finally = async (ctx: Context<WorkspaceContextData>, { payload }: Action<Realtime.customBlock.RemovePayload>): Promise<void> => {
    await this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID);
  };
}

export default RemoveCustomBlock;
