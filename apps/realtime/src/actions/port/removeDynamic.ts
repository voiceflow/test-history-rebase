import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractDiagramActionControl } from '@/actions/diagram/utils';

class RemoveDynamicPort extends AbstractDiagramActionControl<Realtime.port.RemoveDynamicPayload> {
  protected actionCreator = Realtime.port.removeDynamic;

  protected process = async (
    _ctx: Context,
    { payload: { portID, nodeID, diagramID, removeNodes } }: Action<Realtime.port.RemoveDynamicPayload>
  ): Promise<void> => {
    await this.services.diagram.removeDynamicPort(diagramID, { nodeID, portID, removeNodes });
  };

  protected finally = async (ctx: Context, { payload }: Action<Realtime.port.RemoveDynamicPayload>): Promise<void> => {
    await this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID);
  };
}

export default RemoveDynamicPort;
