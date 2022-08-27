import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractVersionDiagramAccessActionControl } from '@/actions/diagram/utils';

class ReorderSteps extends AbstractVersionDiagramAccessActionControl<Realtime.node.ReorderStepsPayload> {
  actionCreator = Realtime.node.reorderSteps;

  process = async (_ctx: Context, { payload }: Action<Realtime.node.ReorderStepsPayload>): Promise<void> => {
    await this.services.diagram.reorderSteps({
      index: payload.index,
      stepID: payload.stepID,
      diagramID: payload.diagramID,
      parentNodeID: payload.parentNodeID,
      nodePortRemaps: payload.nodePortRemaps,
    });
  };
}

export default ReorderSteps;
