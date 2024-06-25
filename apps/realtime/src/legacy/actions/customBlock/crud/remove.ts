import * as Realtime from '@voiceflow/realtime-sdk/backend';
import type { Context } from '@voiceflow/socket-utils';
import type { Action } from 'typescript-fsa';

import { AbstractProjectChannelControl } from '@/legacy/actions/project/utils';

interface Payload extends Realtime.BaseVersionPayload, Realtime.actionUtils.CRUDKeyPayload {}

class RemoveCustomBlock extends AbstractProjectChannelControl<Payload> {
  protected actionCreator = Realtime.customBlock.crud.remove;

  protected process = async (_ctx: Context, { payload }: Action<Payload>) => {
    const { versionID, key: blockID } = payload;

    await this.services.customBlock.delete(versionID, blockID);
  };

  protected finally = async (ctx: Context, { payload }: Action<Payload>): Promise<void> => {
    await this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID);
  };
}

export default RemoveCustomBlock;
