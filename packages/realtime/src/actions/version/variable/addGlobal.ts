import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractVersionResourceControl } from '../utils';

class AddGlobalVariable extends AbstractVersionResourceControl<Realtime.version.variable.GlobalVariablePayload> {
  protected actionCreator = Realtime.version.variable.addGlobal;

  protected process = async (ctx: Context, { payload }: Action<Realtime.version.variable.GlobalVariablePayload>) => {
    const { creatorID } = ctx.data;
    const { variables } = await this.services.version.get(creatorID, payload.versionID);

    await this.services.version.updateVariables(creatorID, payload.versionID, Utils.array.append(variables, payload.variable));
  };
}

export default AddGlobalVariable;
