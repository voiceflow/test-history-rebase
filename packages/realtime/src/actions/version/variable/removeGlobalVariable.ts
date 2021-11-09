import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Action } from 'typescript-fsa';

import { Context } from '@/types';

import { AbstractVersionResourceControl } from '../utils';

class RemoveGlobalVariable extends AbstractVersionResourceControl<Realtime.version.GlobalVariablePayload> {
  protected actionCreator = Realtime.version.removeGlobalVariable;

  protected process = async (ctx: Context, { payload }: Action<Realtime.version.GlobalVariablePayload>) => {
    const { creatorID } = ctx.data;
    const { variables } = await this.services.version.get(creatorID, payload.versionID);

    await this.services.version.updateVariables(creatorID, payload.versionID, Utils.array.withoutValue(variables, payload.variable));
  };
}

export default RemoveGlobalVariable;
