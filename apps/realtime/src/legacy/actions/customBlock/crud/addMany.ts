import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractProjectChannelControl } from '@/legacy/actions/project/utils';

interface Payload extends Realtime.BaseVersionPayload, Realtime.actionUtils.CRUDValuesPayload<Realtime.CustomBlock> {}

class AddManyCustomBlocks extends AbstractProjectChannelControl<Payload> {
  protected actionCreator = Realtime.customBlock.crud.addMany;

  protected process = async (_ctx: Context, { payload }: Action<Payload>) => {
    const { versionID, values } = payload;

    await this.services.customBlock.createMany(versionID, values);
  };

  protected finally = async (ctx: Context, { payload }: Action<Payload>): Promise<void> => {
    await this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID);
  };
}

export default AddManyCustomBlocks;
