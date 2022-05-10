import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractDiagramActionControl } from '@/actions/diagram/utils';

class RemoveDynamicPort extends AbstractDiagramActionControl<Realtime.BasePortPayload> {
  actionCreator = Realtime.port.removeDynamic;

  process = async (ctx: Context, { payload }: Action<Realtime.BasePortPayload>): Promise<void> => {
    await this.services.diagram.removeDynamicPort(ctx.data.creatorID, payload.diagramID, payload.nodeID, payload.portID);
  };
}

export default RemoveDynamicPort;
