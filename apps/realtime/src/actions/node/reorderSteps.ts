import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractVersionDiagramAccessActionControl } from '@/actions/diagram/utils';

class ReorderSteps extends AbstractVersionDiagramAccessActionControl<Realtime.node.ReorderStepsPayload> {
  actionCreator = Realtime.node.reorderSteps;

  protected process = async (_ctx: Context, { payload }: Action<Realtime.node.ReorderStepsPayload>): Promise<void> => {
    await this.services.diagram.reorderSteps({
      index: payload.index,
      stepID: payload.stepID,
      diagramID: payload.diagramID,
      removeNodes: payload.removeNodes,
      parentNodeID: payload.parentNodeID,
      nodePortRemaps: payload.nodePortRemaps ?? [],
    });
  };

  protected finally = async (ctx: Context, { payload }: Action<Realtime.node.ReorderStepsPayload>): Promise<void> => {
    await Promise.all([
      this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID),
      this.services.domain.setUpdatedBy(payload.versionID, payload.domainID, ctx.data.creatorID),
    ]);
  };
}

export default ReorderSteps;
