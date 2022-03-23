import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractDiagramActionControl } from '@/actions/diagram/utils';

class RemoveBuiltinPort extends AbstractDiagramActionControl<Realtime.BasePortPayload> {
  actionCreator = Realtime.port.removeBuiltin;

  process = async (ctx: Context, { payload }: Action<Realtime.BasePortPayload>): Promise<void> => {
    await this.services.diagram.removePort(ctx.data.creatorID, payload.diagramID, payload.nodeID, payload.portID);
  };
}

export default RemoveBuiltinPort;
