import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractWorkspaceChannelControl } from './utils';

interface RemoveWorkspacePayload extends Realtime.BaseCreatorPayload, Realtime.actionUtils.CRUDKeyPayload {}

class RemoveWorkspace extends AbstractWorkspaceChannelControl<RemoveWorkspacePayload> {
  protected actionCreator = Realtime.workspace.crud.remove;

  protected process = async (ctx: Context, { payload }: Action<RemoveWorkspacePayload>) => {
    const { creatorID } = ctx.data;

    const workspace = await this.services.workspace.get(creatorID, payload.key);

    await this.services.workspace.delete(creatorID, payload.key);

    await Promise.all(
      workspace.members.map(
        (member) =>
          member.creator_id &&
          this.server.process(
            Realtime.workspace.member.eject({ removed: true, workspaceID: payload.key, workspaceName: workspace.name, creatorID: member.creator_id })
          )
      )
    );
  };
}

export default RemoveWorkspace;
