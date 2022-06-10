import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractDiagramActionControl } from '@/actions/diagram/utils';

class TransplantSteps extends AbstractDiagramActionControl<Realtime.node.TransplantStepsPayload> {
  actionCreator = Realtime.node.transplantSteps;

  process = async (ctx: Context, { payload }: Action<Realtime.node.TransplantStepsPayload>): Promise<void> => {
    await this.services.diagram.transplantSteps({
      creatorID: ctx.data.creatorID,
      diagramID: payload.diagramID,
      sourceBlockID: payload.sourceBlockID,
      targetBlockID: payload.targetBlockID,
      stepIDs: payload.stepIDs,
      index: payload.index,
      removeSource: payload.removeSource,
      nodePortRemaps: payload.nodePortRemaps,
    });
  };
}

export default TransplantSteps;
