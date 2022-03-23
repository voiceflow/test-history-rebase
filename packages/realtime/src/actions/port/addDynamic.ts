import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractDiagramActionControl } from '@/actions/diagram/utils';

class AddDynamicPort extends AbstractDiagramActionControl<Realtime.port.AddDynamicPayload> {
  actionCreator = Realtime.port.addDynamic;

  process = async (ctx: Context, { payload }: Action<Realtime.port.AddDynamicPayload>): Promise<void> => {
    await this.services.diagram.addPort(ctx.data.creatorID, payload.diagramID, payload.nodeID, {
      id: payload.portID,
      type: payload.label ?? '',
      target: null,
    });
  };
}

export default AddDynamicPort;
