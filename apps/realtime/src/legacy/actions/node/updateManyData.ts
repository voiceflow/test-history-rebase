import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context } from '@voiceflow/socket-utils';
import type { Action } from 'typescript-fsa';

import { AbstractVersionDiagramAccessActionControl } from '@/legacy/actions/diagram/utils';

class UpdateManyNodeData extends AbstractVersionDiagramAccessActionControl<Realtime.node.UpdateManyDataPayload> {
  actionCreator = Realtime.node.updateDataMany;

  protected process = async (ctx: Context, { payload }: Action<Realtime.node.UpdateManyDataPayload>): Promise<void> => {
    const nodes = payload.nodes.map((nodeData) => ({
      nodeID: nodeData.nodeID,
      ...Realtime.Adapters.nodeDataAdapter.toDB(nodeData, {
        platform: payload.projectMeta.platform,
        projectType: payload.projectMeta.type,
        context: {},
      }),
    }));

    await this.services.diagram.updateManyNodeData(payload.versionID, payload.diagramID, nodes);

    if (
      this.services.feature.isEnabled(Realtime.FeatureFlag.REFERENCE_SYSTEM, {
        userID: Number(ctx.userId),
        workspaceID: payload.workspaceID,
      })
    ) {
      await this.services.requestContext.createAsync(async () => {
        await this.services.reference.deleteManyWithSubResourcesByDiagramNodeIDsAndBroadcast(
          { nodeIDs: nodes.map((node) => node.nodeID), diagramID: payload.diagramID },
          {
            auth: { userID: Number(ctx.userId), clientID: ctx.clientId },
            context: { assistantID: payload.projectID, environmentID: payload.versionID },
          }
        );

        await this.services.reference.createManyWithSubResourcesForDiagramNodesAndBroadcast(
          { nodes, diagramID: payload.diagramID },
          {
            auth: { userID: Number(ctx.userId), clientID: ctx.clientId },
            context: { assistantID: payload.projectID, environmentID: payload.versionID },
          }
        );
      });
    }
  };

  protected finally = async (ctx: Context, { payload }: Action<Realtime.node.UpdateManyDataPayload>): Promise<void> => {
    await Promise.all([
      this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID),
      this.setCMSUpdatedBy(ctx, payload),
    ]);
  };
}

export default UpdateManyNodeData;
