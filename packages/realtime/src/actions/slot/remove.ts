import { Context } from '@logux/server';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Action } from 'typescript-fsa';

import { AbstractVersionResourceControl } from '@/actions/version/utils';

type RemoveSlotPayload = Realtime.BaseVersionPayload & Realtime.actionUtils.CRUDKeyPayload;

class RemoveSlot extends AbstractVersionResourceControl<RemoveSlotPayload> {
  protected actionCreator = Realtime.slot.crud.remove;

  protected process = async (ctx: Context, { payload }: Action<RemoveSlotPayload>) => {
    await this.services.slot.delete(Number(ctx.userId), payload.projectID, payload.key);
  };
}

export default RemoveSlot;
