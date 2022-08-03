import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractDiagramActionControl } from '@/actions/diagram/utils';

class AddByKeyPort extends AbstractDiagramActionControl<Realtime.port.AddByKeyPayload> {
  actionCreator = Realtime.port.addByKey;

  process = async (_ctx: Context, { payload }: Action<Realtime.port.AddByKeyPayload>): Promise<void> => {
    await this.services.diagram.addByKeyPort(payload.diagramID, payload.nodeID, payload.key, {
      id: payload.portID,
      target: null,
      type: payload.label ?? '',
    });
  };
}

export default AddByKeyPort;
