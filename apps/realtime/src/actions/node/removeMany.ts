import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractVersionDiagramAccessActionControl } from '@/actions/diagram/utils';

class RemoveManyNodes extends AbstractVersionDiagramAccessActionControl<Realtime.node.RemoveManyPayload> {
  actionCreator = Realtime.node.removeMany;

  protected process = async (ctx: Context, { payload }: Action<Realtime.node.RemoveManyPayload>): Promise<void> => {
    if (!payload.nodes.length) return;

    await this.services.diagram.removeManyNodes(payload.diagramID, {
      nodes: payload.nodes,
      menuNodeIDs: !this.isGESubprotocol(ctx, Realtime.Subprotocol.Version.V1_3_0),
    });
  };

  protected finally = async (ctx: Context, { payload }: Action<Realtime.node.RemoveManyPayload>): Promise<void> => {
    await Promise.all([
      this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID),
      this.services.domain.setUpdatedBy(payload.versionID, payload.domainID, ctx.data.creatorID),
    ]);
  };
}

export default RemoveManyNodes;
