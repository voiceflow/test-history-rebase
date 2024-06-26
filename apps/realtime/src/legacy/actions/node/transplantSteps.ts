import * as Realtime from '@voiceflow/realtime-sdk/backend';
import type { Context } from '@voiceflow/socket-utils';
import type { Action } from 'typescript-fsa';

import { AbstractVersionDiagramAccessActionControl } from '@/legacy/actions/diagram/utils';

class TransplantSteps extends AbstractVersionDiagramAccessActionControl<Realtime.node.TransplantStepsPayload> {
  actionCreator = Realtime.node.transplantSteps;

  protected process = async (
    ctx: Context,
    { payload }: Action<Realtime.node.TransplantStepsPayload>
  ): Promise<void> => {
    await this.services.diagram.transplantSteps({
      index: payload.index,
      stepIDs: payload.stepIDs,
      versionID: payload.versionID,
      diagramID: payload.diagramID,
      removeNodes: payload.removeNodes,
      removeSource: payload.removeSource,
      nodePortRemaps: payload.nodePortRemaps ?? [],
      sourceParentNodeID: payload.sourceParentNodeID,
      targetParentNodeID: payload.targetParentNodeID,
    });

    if (
      this.services.feature.isEnabled(Realtime.FeatureFlag.REFERENCE_SYSTEM, {
        userID: Number(ctx.userId),
        workspaceID: payload.workspaceID,
      })
    ) {
      await this.services.requestContext.create(async () => {
        await this.services.reference.deleteManyWithSubResourcesByDiagramNodeIDsAndBroadcast(
          {
            nodeIDs: [
              ...(payload.removeSource ? [payload.sourceParentNodeID] : []),
              ...payload.removeNodes.map((node) => node.stepID ?? node.parentNodeID),
            ],
            diagramID: payload.diagramID,
          },
          {
            auth: { userID: Number(ctx.userId), clientID: ctx.clientId },
            context: { assistantID: payload.projectID, environmentID: payload.versionID },
          }
        );
      });
    }
  };

  protected finally = async (
    ctx: Context,
    { payload }: Action<Realtime.node.TransplantStepsPayload>
  ): Promise<void> => {
    await Promise.all([
      this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID),
      this.setCMSUpdatedBy(ctx, payload),
    ]);
  };
}

export default TransplantSteps;
