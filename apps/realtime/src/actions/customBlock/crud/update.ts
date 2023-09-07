import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractProjectChannelControl } from '@/actions/project/utils';

interface Payload extends Realtime.BaseVersionPayload, Realtime.actionUtils.CRUDValuePayload<Realtime.CustomBlock> {}

class UpdateCustomBlock extends AbstractProjectChannelControl<Payload> {
  protected actionCreator = Realtime.customBlock.crud.update;

  protected process = async (_ctx: Context, { payload }: Action<Payload>) => {
    const { versionID, key: blockID, value } = payload;

    await this.services.customBlock.update(versionID, blockID, value);
  };

  protected finally = async (ctx: Context, { payload }: Action<Payload>): Promise<void> => {
    await this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID);
  };
}

export default UpdateCustomBlock;
