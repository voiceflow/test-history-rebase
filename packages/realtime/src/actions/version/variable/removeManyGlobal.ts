import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractVersionResourceControl } from '../utils';

class RemoveManyGlobalVariables extends AbstractVersionResourceControl<Realtime.version.variable.GlobalManyVariablesPayload> {
  protected actionCreator = Realtime.version.variable.removeManyGlobal;

  protected process = async (ctx: Context, { payload }: Action<Realtime.version.variable.GlobalManyVariablesPayload>) => {
    const { creatorID } = ctx.data;
    const { variables } = await this.services.version.get(creatorID, payload.versionID);
    await this.services.version.updateVariables(creatorID, payload.versionID, Utils.array.withoutValues(variables, payload.variables));
  };
}

export default RemoveManyGlobalVariables;
