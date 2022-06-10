import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractDiagramActionControl } from '@/actions/diagram/utils';

class ReorderSteps extends AbstractDiagramActionControl<Realtime.node.ReorderStepsPayload> {
  actionCreator = Realtime.node.reorderSteps;

  process = async (ctx: Context, { payload }: Action<Realtime.node.ReorderStepsPayload>): Promise<void> => {
    await this.services.diagram.reorderSteps({
      creatorID: ctx.data.creatorID,
      diagramID: payload.diagramID,
      blockID: payload.blockID,
      stepID: payload.stepID,
      index: payload.index,
      nodePortRemaps: payload.nodePortRemaps,
    });
  };
}

export default ReorderSteps;
