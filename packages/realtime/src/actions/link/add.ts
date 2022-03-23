import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractDiagramActionControl } from '@/actions/diagram/utils';

class AddLink extends AbstractDiagramActionControl<Realtime.link.AddPayload> {
  actionCreator = Realtime.link.add;

  process = async (ctx: Context, { payload }: Action<Realtime.link.AddPayload>): Promise<void> => {
    await this.services.diagram.addLink(ctx.data.creatorID, payload.diagramID, payload.sourceNodeID, payload.sourcePortID, payload.targetNodeID);
  };
}

export default AddLink;
