import * as Realtime from '@voiceflow/realtime-sdk';
import { Action } from 'typescript-fsa';

import { sanitizePatch } from '@/actions/utils';
import { AbstractVersionResourceControl } from '@/actions/version/utils';
import { Context } from '@/types';

type PatchSlotPayload = Realtime.BaseVersionPayload & Realtime.actionUtils.CRUDValuePayload<Partial<Realtime.Slot>>;

class PatchSlot extends AbstractVersionResourceControl<PatchSlotPayload> {
  protected actionCreator = Realtime.slot.crud.patch;

  protected process = async (ctx: Context, { payload }: Action<PatchSlotPayload>) => {
    const { creatorID } = ctx.data;
    const slots = await this.services.slot.getAll(creatorID, payload.versionID).then(Realtime.Adapters.slotAdapter.mapFromDB);

    await this.services.slot.replaceAll(
      creatorID,
      payload.versionID,
      Realtime.Adapters.slotAdapter.mapToDB(
        slots.map((slot) => {
          if (slot.id !== payload.key) return slot;

          return { ...slot, ...sanitizePatch(payload.value) };
        })
      )
    );
  };
}

export default PatchSlot;
