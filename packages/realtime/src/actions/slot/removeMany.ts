import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractVersionResourceControl } from '@/actions/version/utils';

type RemoveManySlotPayload = Realtime.BaseVersionPayload & Realtime.actionUtils.CRUDKeysPayload;

class RemoveManySlots extends AbstractVersionResourceControl<RemoveManySlotPayload> {
  protected actionCreator = Realtime.slot.crud.removeMany;

  protected process = async (ctx: Context, { payload }: Action<RemoveManySlotPayload>) => {
    await this.services.slot.deleteMany(ctx.data.creatorID, payload.versionID, payload.keys);
  };
}

export default RemoveManySlots;
