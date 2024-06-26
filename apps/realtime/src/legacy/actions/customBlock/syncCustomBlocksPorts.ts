import type { Context } from '@logux/server';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import type { Action } from 'typescript-fsa';

import { AbstractProjectChannelControl } from '@/legacy/actions/project/utils';
import type { WorkspaceContextData } from '@/legacy/actions/workspace/utils';

class SyncCustomBlockPorts extends AbstractProjectChannelControl<Realtime.port.SyncCustomBlockPortsPayload> {
  protected actionCreator = Realtime.port.syncCustomBlockPorts;

  protected process = async (
    _cxt: Context,
    { payload }: Action<Realtime.port.SyncCustomBlockPortsPayload>
  ): Promise<void> => {
    const { versionID, diagramID, patchData } = payload;

    await this.services.diagram.syncCustomBlockPorts(versionID, diagramID, patchData);
  };

  protected finally = async (
    ctx: Context<WorkspaceContextData>,
    { payload }: Action<Realtime.port.SyncCustomBlockPortsPayload>
  ): Promise<void> => {
    await this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID);
  };
}

export default SyncCustomBlockPorts;
