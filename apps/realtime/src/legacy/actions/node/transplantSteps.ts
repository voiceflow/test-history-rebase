import * as Realtime from '@voiceflow/realtime-sdk/backend';
import type { Context } from '@voiceflow/socket-utils';
import type { Action } from 'typescript-fsa';

import { AbstractVersionDiagramAccessActionControl } from '@/legacy/actions/diagram/utils';

class TransplantSteps extends AbstractVersionDiagramAccessActionControl<Realtime.node.TransplantStepsPayload> {
  actionCreator = Realtime.node.transplantSteps;

  protected process = async (
    _ctx: Context,
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
  };

  protected finally = async (
    ctx: Context,
    { payload }: Action<Realtime.node.TransplantStepsPayload>
  ): Promise<void> => {
    await Promise.all([
      this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID),
      this.services.domain.setUpdatedBy(payload.versionID, payload.domainID, ctx.data.creatorID),
      this.setCMSUpdatedBy(ctx, payload),
    ]);
  };
}

export default TransplantSteps;
