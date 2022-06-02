import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractDiagramActionControl } from '@/actions/diagram/utils';

class AddByKeyPort extends AbstractDiagramActionControl<Realtime.port.AddByKeyPayload> {
  actionCreator = Realtime.port.addByKey;

  process = async (ctx: Context, { payload }: Action<Realtime.port.AddByKeyPayload>): Promise<void> => {
    await this.services.diagram.addByKeyPort(
      ctx.data.creatorID,
      payload.diagramID,
      payload.nodeID,
      {
        id: payload.portID,
        target: null,
        type: payload.label ?? '',
      },
      payload.key
    );
  };
}

export default AddByKeyPort;
