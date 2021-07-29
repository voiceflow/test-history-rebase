import type { Context } from '@logux/server';
import * as Realtime from '@voiceflow/realtime-sdk';
import type { Action } from 'typescript-fsa';

import { AbstractResendWorkspaceActionControl } from '../utils';

class RemoveProject extends AbstractResendWorkspaceActionControl<Realtime.BaseWorkspacePayload & Realtime.actionUtils.CRUDKeyPayload> {
  actionCreator = Realtime.project.crudActions.remove;

  process = async (ctx: Context, { payload }: Action<Realtime.BaseWorkspacePayload & Realtime.actionUtils.CRUDKeyPayload>): Promise<void> => {
    await this.services.project.remove(payload.key, Number(ctx.userId));
  };
}

export default RemoveProject;
