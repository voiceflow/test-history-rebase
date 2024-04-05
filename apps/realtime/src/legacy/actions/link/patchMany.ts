import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractDiagramActionControl } from '@/legacy/actions/diagram/utils';

class PatchManyLinks extends AbstractDiagramActionControl<Realtime.link.PatchManyPayload> {
  actionCreator = Realtime.link.patchMany;

  protected process = async (_ctx: Context, { payload }: Action<Realtime.link.PatchManyPayload>): Promise<void> => {
    await this.services.diagram.patchManyLinks(
      payload.versionID,
      payload.diagramID,
      payload.patches.map((patch) => {
        if (patch.type) return { nodeID: patch.nodeID, type: patch.type, data: patch.data };
        if (patch.key) return { nodeID: patch.nodeID, key: patch.key, data: patch.data };
        return { nodeID: patch.nodeID, portID: patch.portID, data: patch.data };
      })
    );
  };

  protected finally = async (ctx: Context, { payload }: Action<Realtime.link.PatchManyPayload>): Promise<void> => {
    await Promise.all([
      this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID),
      this.services.domain.setUpdatedBy(payload.versionID, payload.domainID, ctx.data.creatorID),
      this.setCMSUpdatedBy(ctx, payload),
    ]);
  };
}

export default PatchManyLinks;
