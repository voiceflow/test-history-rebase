import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractVersionResourceControl } from '../utils';

class RemoveGlobalVariable extends AbstractVersionResourceControl<Realtime.version.variable.GlobalVariablePayload> {
  protected actionCreator = Realtime.version.variable.removeGlobal;

  protected process = async (ctx: Context, { payload }: Action<Realtime.version.variable.GlobalVariablePayload>) => {
    const { creatorID } = ctx.data;
    const { variables } = await this.services.version.get(creatorID, payload.versionID);

    await this.services.version.updateVariables(creatorID, payload.versionID, Utils.array.withoutValue(variables, payload.variable));
  };
}

export default RemoveGlobalVariable;
