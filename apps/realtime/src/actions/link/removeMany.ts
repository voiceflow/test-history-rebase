import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractDiagramActionControl } from '@/actions/diagram/utils';

class RemoveManyLinks extends AbstractDiagramActionControl<Realtime.link.RemoveManyPayload> {
  actionCreator = Realtime.link.removeMany;

  protected process = async (_ctx: Context, { payload }: Action<Realtime.link.RemoveManyPayload>): Promise<void> => {
    await this.services.diagram.removeManyLinks(
      payload.diagramID,
      payload.links.map((link) => (link.type ? { nodeID: link.nodeID, type: link.type } : { nodeID: link.nodeID, portID: link.portID }))
    );
  };

  protected finally = async (ctx: Context, { payload }: Action<Realtime.link.RemoveManyPayload>): Promise<void> => {
    await this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID);
  };
}

export default RemoveManyLinks;
