import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractVersionDiagramAccessActionControl } from '@/legacy/actions/diagram/utils';

class RemoveManyNodes extends AbstractVersionDiagramAccessActionControl<Realtime.node.RemoveManyPayload> {
  actionCreator = Realtime.node.removeMany;

  protected process = async (_ctx: Context, { payload }: Action<Realtime.node.RemoveManyPayload>): Promise<void> => {
    if (!payload.nodes.length) return;

    await this.services.diagram.removeManyNodes(payload.versionID, payload.diagramID, { nodes: payload.nodes });
  };

  protected finally = async (ctx: Context, { payload }: Action<Realtime.node.RemoveManyPayload>): Promise<void> => {
    await Promise.all([
      this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID),
      this.services.domain.setUpdatedBy(payload.versionID, payload.domainID, ctx.data.creatorID),
      this.setFlowUpdatedBy(ctx, payload),
    ]);
  };
}

export default RemoveManyNodes;
