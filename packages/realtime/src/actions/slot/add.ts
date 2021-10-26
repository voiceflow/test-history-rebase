import * as Realtime from '@voiceflow/realtime-sdk';
import { Action } from 'typescript-fsa';

import { AbstractVersionResourceControl } from '@/actions/version/utils';
import { Context } from '@/types';

type AddSlotPayload = Realtime.BaseVersionPayload & Realtime.actionUtils.CRUDValuePayload<Realtime.Slot>;

class AddSlot extends AbstractVersionResourceControl<AddSlotPayload> {
  protected actionCreator = Realtime.slot.crud.add;

  protected process = async (ctx: Context, { payload }: Action<AddSlotPayload>) => {
    await this.services.slot.create(ctx.data.creatorID, payload.versionID, {
      ...Realtime.Adapters.slotAdapter.toDB(payload.value),
      key: payload.key,
    });
  };
}

export default AddSlot;
