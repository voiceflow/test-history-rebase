import * as Realtime from '@voiceflow/realtime-sdk';
import { Context, sanitizePatch } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractVersionResourceControl } from '@/actions/version/utils';

type PatchSlotPayload = Realtime.BaseVersionPayload & Realtime.actionUtils.CRUDValuePayload<Partial<Realtime.Slot>>;

class PatchSlot extends AbstractVersionResourceControl<PatchSlotPayload> {
  protected actionCreator = Realtime.slot.crud.patch;

  protected process = async (_ctx: Context, { payload }: Action<PatchSlotPayload>) => {
    const slots = await this.services.slot.getAll(payload.versionID).then(Realtime.Adapters.slotAdapter.mapFromDB);

    await this.services.slot.replaceAll(
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
