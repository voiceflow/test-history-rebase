import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context } from '@voiceflow/socket-utils';
import type { Action } from 'typescript-fsa';

import { AbstractWorkspaceChannelControl } from '@/legacy/actions/workspace/utils';

type RemoveManyProjectsPayload = Realtime.BaseWorkspacePayload & Realtime.actionUtils.CRUDKeysPayload;

class RemoveManyProjects extends AbstractWorkspaceChannelControl<RemoveManyProjectsPayload> {
  protected actionCreator = Realtime.project.crud.removeMany;

  protected process = async (ctx: Context, { payload }: Action<RemoveManyProjectsPayload>): Promise<void> => {
    const { creatorID } = ctx.data;

    // TODO: add remove many endpoint and method to ApiSdk and project service
    await Promise.all(payload.keys.map((key) => this.services.project.delete(creatorID, key, payload.workspaceID)));
  };
}

export default RemoveManyProjects;
