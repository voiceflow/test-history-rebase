import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context } from '@voiceflow/socket-utils';
import type { Action } from 'typescript-fsa';

import { AbstractVersionResourceControl } from '@/actions/version/utils';

type RemoveVariableStatePayload = Realtime.BaseVersionPayload & Realtime.actionUtils.CRUDKeyPayload;

class RemoveVariableState extends AbstractVersionResourceControl<RemoveVariableStatePayload> {
  protected actionCreator = Realtime.variableState.crud.remove;

  protected process = async (ctx: Context, { payload }: Action<RemoveVariableStatePayload>): Promise<void> => {
    await this.services.variableState.delete(ctx.data.creatorID, payload.key);
  };
}

export default RemoveVariableState;
