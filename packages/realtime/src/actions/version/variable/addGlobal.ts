import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractVersionResourceControl } from '../utils';

class AddGlobalVariable extends AbstractVersionResourceControl<Realtime.version.variable.GlobalVariablePayload> {
  protected actionCreator = Realtime.version.variable.addGlobal;

  protected process = async (_ctx: Context, { payload }: Action<Realtime.version.variable.GlobalVariablePayload>) => {
    await this.services.variable.add(payload.versionID, payload.variable);
  };
}

export default AddGlobalVariable;
