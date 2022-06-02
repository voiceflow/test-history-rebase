import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractDiagramActionControl } from '@/actions/diagram/utils';

class RemoveByKeyPort extends AbstractDiagramActionControl<Realtime.port.RemoveByKeyPayload> {
  actionCreator = Realtime.port.removeByKey;

  process = async (ctx: Context, { payload }: Action<Realtime.port.RemoveByKeyPayload>): Promise<void> => {
    await this.services.diagram.removeByKeyPort(ctx.data.creatorID, payload.diagramID, payload.nodeID, payload.key);
  };
}

export default RemoveByKeyPort;
