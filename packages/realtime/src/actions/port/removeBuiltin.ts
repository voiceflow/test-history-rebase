import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractDiagramActionControl } from '@/actions/diagram/utils';

class RemoveBuiltinPort extends AbstractDiagramActionControl<Realtime.port.RemoveBuiltinPayload> {
  actionCreator = Realtime.port.removeBuiltin;

  process = async (ctx: Context, { payload }: Action<Realtime.port.RemoveBuiltinPayload>): Promise<void> => {
    await this.services.diagram.removeBuiltInPort(ctx.data.creatorID, payload.diagramID, payload.nodeID, payload.type);
  };
}

export default RemoveBuiltinPort;
