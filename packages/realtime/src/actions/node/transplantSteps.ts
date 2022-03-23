import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractDiagramActionControl } from '@/actions/diagram/utils';

class TransplantSteps extends AbstractDiagramActionControl<Realtime.node.TransplantStepsPayload> {
  actionCreator = Realtime.node.transplantSteps;

  process = async (ctx: Context, { payload }: Action<Realtime.node.TransplantStepsPayload>): Promise<void> => {
    await this.services.diagram.transplantSteps(
      ctx.data.creatorID,
      payload.diagramID,
      payload.sourceBlockID,
      payload.targetBlockID,
      payload.stepIDs,
      payload.index
    );
  };
}

export default TransplantSteps;
