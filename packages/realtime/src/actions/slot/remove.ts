import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractVersionResourceControl } from '@/actions/version/utils';

type RemoveSlotPayload = Realtime.BaseVersionPayload & Realtime.actionUtils.CRUDKeyPayload;

class RemoveSlot extends AbstractVersionResourceControl<RemoveSlotPayload> {
  protected actionCreator = Realtime.slot.crud.remove;

  protected process = async (ctx: Context, { payload }: Action<RemoveSlotPayload>) => {
    await this.services.slot.delete(ctx.data.creatorID, payload.versionID, payload.key);
  };
}

export default RemoveSlot;
