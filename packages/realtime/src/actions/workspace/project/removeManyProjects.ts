import type { Context } from '@logux/server';
import * as Realtime from '@voiceflow/realtime-sdk';
import _ from 'lodash';
import type { Action } from 'typescript-fsa';

import { AbstractResendWorkspaceActionControl } from '../utils';

class RemoveManyProjects extends AbstractResendWorkspaceActionControl<Realtime.BaseWorkspacePayload & Realtime.actionUtils.CRUDKeysPayload> {
  actionCreator = Realtime.project.crudActions.removeMany;

  process = async (ctx: Context, { payload }: Action<Realtime.BaseWorkspacePayload & Realtime.actionUtils.CRUDKeysPayload>): Promise<void> => {
    const creatorID = Number(ctx.userId);

    // TODO: add remove many endpoint and method to ApiSdk and project service
    await Promise.all(payload.keys.map((key) => this.services.project.remove(key, creatorID)));
  };
}

export default RemoveManyProjects;
