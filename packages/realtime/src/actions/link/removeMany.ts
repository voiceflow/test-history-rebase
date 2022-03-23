import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractDiagramActionControl } from '@/actions/diagram/utils';

class RemoveManyLinks extends AbstractDiagramActionControl<Realtime.link.RemoveManyPayload> {
  actionCreator = Realtime.link.removeMany;

  process = async (ctx: Context, { payload }: Action<Realtime.link.RemoveManyPayload>): Promise<void> => {
    await this.services.diagram.removeManyLinks(
      ctx.data.creatorID,
      payload.diagramID,
      payload.links.map((link) => ({ nodeID: link.nodeID, portID: link.portID }))
    );
  };
}

export default RemoveManyLinks;
