import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractVersionResourceControl } from '../utils';

class RemoveGlobalVariable extends AbstractVersionResourceControl<Realtime.version.variable.GlobalVariablePayload> {
  protected actionCreator = Realtime.version.variable.removeGlobal;

  protected process = async (_ctx: Context, { payload }: Action<Realtime.version.variable.GlobalVariablePayload>) => {
    await this.services.variable.delete(payload.versionID, payload.variable);
  };
}

export default RemoveGlobalVariable;
