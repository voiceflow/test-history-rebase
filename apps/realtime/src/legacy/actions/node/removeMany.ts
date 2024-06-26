import * as Realtime from '@voiceflow/realtime-sdk/backend';
import type { Context } from '@voiceflow/socket-utils';
import type { Action } from 'typescript-fsa';

import { AbstractVersionDiagramAccessActionControl } from '@/legacy/actions/diagram/utils';

class RemoveManyNodes extends AbstractVersionDiagramAccessActionControl<Realtime.node.RemoveManyPayload> {
  actionCreator = Realtime.node.removeMany;

  protected process = async (ctx: Context, { payload }: Action<Realtime.node.RemoveManyPayload>): Promise<void> => {
    if (!payload.nodes.length) return;

    await this.services.diagram.removeManyNodes(payload.versionID, payload.diagramID, { nodes: payload.nodes });

    if (
      this.services.feature.isEnabled(Realtime.FeatureFlag.REFERENCE_SYSTEM, {
        userID: Number(ctx.userId),
        workspaceID: payload.workspaceID,
      })
    ) {
      await this.services.requestContext.create(async () => {
        await this.services.reference.deleteManyWithSubResourcesByDiagramNodeIDsAndBroadcast(
          { nodeIDs: payload.nodes.map((node) => node.stepID ?? node.parentNodeID), diagramID: payload.diagramID },
          {
            auth: { userID: Number(ctx.userId), clientID: ctx.clientId },
            context: { assistantID: payload.projectID, environmentID: payload.versionID },
          }
        );
      });
    }
  };

  protected finally = async (ctx: Context, { payload }: Action<Realtime.node.RemoveManyPayload>): Promise<void> => {
    await Promise.all([
      this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID),
      this.setCMSUpdatedBy(ctx, payload),
    ]);
  };
}

export default RemoveManyNodes;
