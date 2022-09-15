import * as Realtime from '@voiceflow/realtime-sdk';
import { Context, sanitizePatch } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractVersionResourceControl } from '@/actions/version/utils';

type PatchSlotPayload = Realtime.BaseVersionPayload & Realtime.actionUtils.CRUDValuePayload<Partial<Realtime.Slot>>;

class PatchSlot extends AbstractVersionResourceControl<PatchSlotPayload> {
  protected actionCreator = Realtime.slot.crud.patch;

  protected process = async (_ctx: Context, { payload }: Action<PatchSlotPayload>) => {
    const { versionID, key, value } = payload;

    await this.services.slot.update(versionID, key, Realtime.Adapters.slotSmartAdapter.toDB(sanitizePatch(value)));
  };
}

export default PatchSlot;
