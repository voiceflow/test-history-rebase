import * as Realtime from '@voiceflow/realtime-sdk';
import { Action } from 'typescript-fsa';

import { AbstractVersionResourceControl } from '@/actions/version/utils';
import { Context } from '@/types';

type RemoveSlotPayload = Realtime.BaseVersionPayload & Realtime.actionUtils.CRUDKeyPayload;

class RemoveSlot extends AbstractVersionResourceControl<RemoveSlotPayload> {
  protected actionCreator = Realtime.slot.crud.remove;

  protected process = async (ctx: Context, { payload }: Action<RemoveSlotPayload>) => {
    await this.services.slot.delete(ctx.data.creatorID, payload.versionID, payload.key);
  };
}

export default RemoveSlot;
