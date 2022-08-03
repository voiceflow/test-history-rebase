import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractDiagramActionControl } from '@/actions/diagram/utils';

class AddBuiltinPort extends AbstractDiagramActionControl<Realtime.port.BuiltinPayload> {
  actionCreator = Realtime.port.addBuiltin;

  process = async (_ctx: Context, { payload }: Action<Realtime.port.BuiltinPayload>): Promise<void> => {
    await this.services.diagram.addBuiltInPort(payload.diagramID, payload.nodeID, payload.type, {
      id: payload.portID,
      type: payload.type,
      target: null,
    });
  };
}

export default AddBuiltinPort;
