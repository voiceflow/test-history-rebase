import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractDiagramActionControl } from '@/actions/diagram/utils';

class RemoveManyByKeyPorts extends AbstractDiagramActionControl<Realtime.port.RemoveManyByKeyPayload> {
  actionCreator = Realtime.port.removeManyByKey;

  process = async (_ctx: Context, { payload }: Action<Realtime.port.RemoveManyByKeyPayload>): Promise<void> => {
    await this.services.diagram.removeManyPorts(
      payload.diagramID,
      payload.nodeID,
      payload.keys.map((key) => ({ key }))
    );
  };
}

export default RemoveManyByKeyPorts;
