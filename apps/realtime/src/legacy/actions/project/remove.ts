import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context } from '@voiceflow/socket-utils';
import type { Action } from 'typescript-fsa';

import { AbstractWorkspaceChannelControl } from '@/legacy/actions/workspace/utils';

type RemoveProjectPayload = Realtime.BaseWorkspacePayload & Realtime.actionUtils.CRUDKeyPayload;

class RemoveProject extends AbstractWorkspaceChannelControl<RemoveProjectPayload> {
  protected actionCreator = Realtime.project.crud.remove;

  protected process = async (ctx: Context, { payload }: Action<RemoveProjectPayload>): Promise<void> => {
    await this.services.project.delete(ctx.data.creatorID, payload.key);
    await this.server.process(Realtime.project.ejectUsers({ ...payload, projectID: payload.key, creatorID: ctx.data.creatorID }));
  };
}

export default RemoveProject;
