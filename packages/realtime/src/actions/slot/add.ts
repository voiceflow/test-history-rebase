import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractVersionResourceControl } from '@/actions/version/utils';

type AddSlotPayload = Realtime.BaseVersionPayload & Realtime.actionUtils.CRUDValuePayload<Realtime.Slot>;

class AddSlot extends AbstractVersionResourceControl<AddSlotPayload> {
  protected actionCreator = Realtime.slot.crud.add;

  protected process = async (_ctx: Context, { payload }: Action<AddSlotPayload>) => {
    await this.services.slot.create(payload.versionID, {
      ...Realtime.Adapters.slotAdapter.toDB(payload.value),
      key: payload.key,
    });
  };
}

export default AddSlot;
