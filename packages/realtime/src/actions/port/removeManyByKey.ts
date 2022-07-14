import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractDiagramActionControl } from '@/actions/diagram/utils';

class RemoveManyByKeyPorts extends AbstractDiagramActionControl<Realtime.port.RemoveManyByKeyPayload> {
  actionCreator = Realtime.port.removeManyByKey;

  process = async (ctx: Context, { payload }: Action<Realtime.port.RemoveManyByKeyPayload>): Promise<void> => {
    await this.services.diagram.removeManyByKeyPort(ctx.data.creatorID, payload.diagramID, payload.nodeID, payload.keys);
  };
}

export default RemoveManyByKeyPorts;
