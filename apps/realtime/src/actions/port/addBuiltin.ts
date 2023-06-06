import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractDiagramActionControl } from '@/actions/diagram/utils';

class AddBuiltinPort extends AbstractDiagramActionControl<Realtime.port.AddBuiltinPayload> {
  protected actionCreator = Realtime.port.addBuiltin;

  protected process = async (_ctx: Context, { payload }: Action<Realtime.port.AddBuiltinPayload>): Promise<void> => {
    await this.services.diagram.addBuiltInPort(payload.diagramID, payload.nodeID, payload.type, {
      id: payload.portID,
      type: payload.type,
      target: null,
    });
  };

  protected finally = async (ctx: Context, { payload }: Action<Realtime.port.AddBuiltinPayload>): Promise<void> => {
    await this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID);
  };
}

export default AddBuiltinPort;
