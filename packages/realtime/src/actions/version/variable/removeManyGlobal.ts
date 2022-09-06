import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractVersionResourceControl } from '../utils';

class RemoveManyGlobalVariables extends AbstractVersionResourceControl<Realtime.version.variable.GlobalManyVariablesPayload> {
  protected actionCreator = Realtime.version.variable.removeManyGlobal;

  protected process = async (_ctx: Context, { payload }: Action<Realtime.version.variable.GlobalManyVariablesPayload>) => {
    await this.services.variable.deleteMany(payload.versionID, payload.variables);
  };
}

export default RemoveManyGlobalVariables;
