import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context } from '@voiceflow/socket-utils';
import type { Action } from 'typescript-fsa';

import { AbstractVersionDiagramAccessActionControl } from '@/legacy/actions/diagram/utils';

class UpdateManyNodeData extends AbstractVersionDiagramAccessActionControl<Realtime.node.UpdateManyDataPayload> {
  actionCreator = Realtime.node.updateDataMany;

  protected process = async (_ctx: Context, { payload }: Action<Realtime.node.UpdateManyDataPayload>): Promise<void> => {
    const nodes = payload.nodes.map((nodeData) => ({
      nodeID: nodeData.nodeID,
      ...Realtime.Adapters.nodeDataAdapter.toDB(nodeData, {
        platform: payload.projectMeta.platform,
        projectType: payload.projectMeta.type,
        context: {},
      }),
    }));

    await this.services.diagram.updateManyNodeData(payload.versionID, payload.diagramID, nodes);
  };

  protected finally = async (ctx: Context, { payload }: Action<Realtime.node.UpdateManyDataPayload>): Promise<void> => {
    await Promise.all([
      this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID),
      this.services.domain.setUpdatedBy(payload.versionID, payload.domainID, ctx.data.creatorID),
      this.setFlowUpdatedBy(ctx, payload),
    ]);
  };
}

export default UpdateManyNodeData;
