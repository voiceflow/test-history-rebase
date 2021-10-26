import * as Realtime from '@voiceflow/realtime-sdk';
import { Action } from 'typescript-fsa';

import { AbstractVersionResourceControl } from '@/actions/version/utils';
import { Context } from '@/types';

type RemoveIntentPayload = Realtime.BaseVersionPayload & Realtime.actionUtils.CRUDKeyPayload;

class RemoveIntent extends AbstractVersionResourceControl<RemoveIntentPayload> {
  protected actionCreator = Realtime.intent.crud.remove;

  protected process = async (ctx: Context, { payload }: Action<RemoveIntentPayload>) => {
    await this.services.intent.delete(ctx.data.creatorID, payload.versionID, payload.key);
  };
}

export default RemoveIntent;
