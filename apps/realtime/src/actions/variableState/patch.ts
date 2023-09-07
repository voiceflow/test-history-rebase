import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractVersionResourceControl } from '@/actions/version/utils';

type PatchVariableStatePayload = Realtime.BaseVersionPayload & Realtime.actionUtils.CRUDValuePayload<Partial<Realtime.VariableState>>;

class PatchVariableState extends AbstractVersionResourceControl<PatchVariableStatePayload> {
  protected actionCreator = Realtime.variableState.crud.patch;

  protected process = async (ctx: Context, { payload }: Action<PatchVariableStatePayload>) => {
    const updatedVariableState = Utils.object.pick(payload.value, ['name', 'startFrom', 'variables']);

    await this.services.variableState.patch(ctx.data.creatorID, payload.key, updatedVariableState);
  };
}

export default PatchVariableState;
