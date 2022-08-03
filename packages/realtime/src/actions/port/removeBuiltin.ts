import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractDiagramActionControl } from '@/actions/diagram/utils';

class RemoveBuiltinPort extends AbstractDiagramActionControl<Realtime.port.BuiltinPayload> {
  actionCreator = Realtime.port.removeBuiltin;

  process = async (_ctx: Context, { payload }: Action<Realtime.port.BuiltinPayload>): Promise<void> => {
    await this.services.diagram.removeBuiltInPort(payload.diagramID, payload.nodeID, payload.type);
  };
}

export default RemoveBuiltinPort;
