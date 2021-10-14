import { Context } from '@logux/server';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Action } from 'typescript-fsa';

import { AbstractVersionResourceControl } from '@/actions/version/utils';

type AddSlotPayload = Realtime.BaseVersionPayload & Realtime.actionUtils.CRUDValuePayload<Realtime.Slot>;

class AddSlot extends AbstractVersionResourceControl<AddSlotPayload> {
  protected actionCreator = Realtime.slot.crud.add;

  protected process = async (ctx: Context, { payload }: Action<AddSlotPayload>) => {
    await this.services.slot.create(Number(ctx.userId), payload.versionID, {
      ...Realtime.Adapters.slotAdapter.toDB(payload.value),
      key: payload.key,
    });
  };
}

export default AddSlot;
