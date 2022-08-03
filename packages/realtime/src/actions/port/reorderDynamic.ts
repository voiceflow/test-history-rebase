import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractDiagramActionControl } from '@/actions/diagram/utils';

class ReorderDynamicPort extends AbstractDiagramActionControl<Realtime.port.ReorderDynamicPayload> {
  actionCreator = Realtime.port.reorderDynamic;

  process = async (_ctx: Context, { payload }: Action<Realtime.port.ReorderDynamicPayload>): Promise<void> => {
    await this.services.diagram.reorderPorts(payload.diagramID, payload.nodeID, payload.portID, payload.index);
  };
}

export default ReorderDynamicPort;
