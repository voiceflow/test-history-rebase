import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractVersionResourceControl } from '@/legacy/actions/version/utils';

interface RemoveManySlotPayload extends Realtime.BaseVersionPayload, Realtime.actionUtils.CRUDKeysPayload {}

class RemoveManySlots extends AbstractVersionResourceControl<RemoveManySlotPayload> {
  protected actionCreator = Realtime.slot.crud.removeMany;

  protected process = async (_ctx: Context, { payload }: Action<RemoveManySlotPayload>) => {
    await this.services.slot.deleteMany(payload.versionID, payload.keys);
  };

  protected finally = async (ctx: Context, { payload }: Action<RemoveManySlotPayload>): Promise<void> => {
    await this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID);
  };
}

export default RemoveManySlots;
