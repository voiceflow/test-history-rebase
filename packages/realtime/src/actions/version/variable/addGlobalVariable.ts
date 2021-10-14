import { Context } from '@logux/server';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Action } from 'typescript-fsa';

import { AbstractVersionResourceControl } from '../utils';

class AddGlobalVariable extends AbstractVersionResourceControl<Realtime.version.GlobalVariablePayload> {
  protected actionCreator = Realtime.version.addGlobalVariable;

  protected process = async (ctx: Context, { payload }: Action<Realtime.version.GlobalVariablePayload>) => {
    const creatorID = Number(ctx.userId);
    const { variables } = await this.services.version.get(creatorID, payload.versionID);

    await this.services.version.updateVariables(creatorID, payload.versionID, Realtime.Utils.array.append(variables, payload.variable));
  };
}

export default AddGlobalVariable;
