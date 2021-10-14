import { Context } from '@logux/server';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Action } from 'typescript-fsa';

import { AbstractVersionResourceControl } from '@/actions/version/utils';

type RemoveIntentPayload = Realtime.BaseVersionPayload & Realtime.actionUtils.CRUDKeyPayload;

class RemoveIntent extends AbstractVersionResourceControl<RemoveIntentPayload> {
  protected actionCreator = Realtime.intent.crud.remove;

  protected process = async (ctx: Context, { payload }: Action<RemoveIntentPayload>) => {
    await this.services.slot.delete(Number(ctx.userId), payload.projectID, payload.key);
  };
}

export default RemoveIntent;
