import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractVersionResourceControl } from '../utils';

class AddGlobalVariable extends AbstractVersionResourceControl<Realtime.version.variable.GlobalVariablePayload> {
  protected actionCreator = Realtime.version.variable.addGlobal;

  protected process = async (_ctx: Context, { payload }: Action<Realtime.version.variable.GlobalVariablePayload>) => {
    await this.services.variable.add(payload.versionID, payload.variable);
  };

  protected finally = async (ctx: Context, { payload }: Action<Realtime.version.variable.GlobalVariablePayload>): Promise<void> => {
    await this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID);
  };
}

export default AddGlobalVariable;
