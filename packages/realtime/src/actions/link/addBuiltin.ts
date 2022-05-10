import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractDiagramActionControl } from '@/actions/diagram/utils';

class AddBuiltinLink extends AbstractDiagramActionControl<Realtime.link.AddBuiltinPayload> {
  actionCreator = Realtime.link.addBuiltin;

  process = async (ctx: Context, { payload }: Action<Realtime.link.AddBuiltinPayload>): Promise<void> => {
    await this.services.diagram.addBuiltInLink(ctx.data.creatorID, payload.diagramID, payload.sourceNodeID, payload.type, payload.targetNodeID);
  };
}

export default AddBuiltinLink;
