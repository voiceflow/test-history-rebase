import * as Realtime from '@voiceflow/realtime-sdk';
import { Action } from 'typescript-fsa';

import { AbstractVersionResourceControl } from '@/actions/version/utils';
import { Context } from '@/types';

type AddManySlotsPayload = Realtime.BaseVersionPayload & Realtime.actionUtils.CRUDValuesPayload<Realtime.Slot>;

class AddManySlots extends AbstractVersionResourceControl<AddManySlotsPayload> {
  protected actionCreator = Realtime.slot.crud.addMany;

  protected process = async (ctx: Context, { payload }: Action<AddManySlotsPayload>) => {
    await this.services.slot.createMany(ctx.data.creatorID, payload.versionID, Realtime.Adapters.slotAdapter.mapToDB(payload.values));
  };
}

export default AddManySlots;
