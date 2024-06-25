import * as Realtime from '@voiceflow/realtime-sdk/backend';
import type { Context } from '@voiceflow/socket-utils';
import type { Action } from 'typescript-fsa';

import { AbstractDiagramActionControl } from '@/legacy/actions/diagram/utils';

class RemoveManyLinks extends AbstractDiagramActionControl<Realtime.link.RemoveManyPayload> {
  actionCreator = Realtime.link.removeMany;

  protected process = async (_ctx: Context, { payload }: Action<Realtime.link.RemoveManyPayload>): Promise<void> => {
    await this.services.diagram.removeManyLinks(
      payload.versionID,
      payload.diagramID,
      payload.links.map((link) => {
        if (link.type) return { nodeID: link.nodeID, type: link.type };
        if (link.key) return { nodeID: link.nodeID, key: link.key };

        return { nodeID: link.nodeID, portID: link.portID };
      })
    );
  };

  protected finally = async (ctx: Context, { payload }: Action<Realtime.link.RemoveManyPayload>): Promise<void> => {
    await Promise.all([
      this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID),
      this.setCMSUpdatedBy(ctx, payload),
    ]);
  };
}

export default RemoveManyLinks;
