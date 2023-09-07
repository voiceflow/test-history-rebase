import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractDiagramActionControl } from '@/actions/diagram/utils';

class RemoveManyByKeyPorts extends AbstractDiagramActionControl<Realtime.port.RemoveManyByKeyPayload> {
  protected actionCreator = Realtime.port.removeManyByKey;

  protected process = async (
    _ctx: Context,
    { payload: { keys, nodeID, diagramID, removeNodes } }: Action<Realtime.port.RemoveManyByKeyPayload>
  ): Promise<void> => {
    await this.services.diagram.removeManyPorts(diagramID, { nodeID, ports: keys.map((key) => ({ key })), removeNodes });
  };

  protected finally = async (ctx: Context, { payload }: Action<Realtime.port.RemoveManyByKeyPayload>): Promise<void> => {
    await Promise.all([
      this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID),
      this.services.domain.setUpdatedBy(payload.versionID, payload.domainID, ctx.data.creatorID),
    ]);
  };
}

export default RemoveManyByKeyPorts;
