import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractDiagramActionControl } from '@/actions/diagram/utils';

class ReorderSteps extends AbstractDiagramActionControl<Realtime.node.ReorderStepsPayload> {
  actionCreator = Realtime.node.reorderSteps;

  process = async (ctx: Context, { payload }: Action<Realtime.node.ReorderStepsPayload>): Promise<void> => {
    await this.services.diagram.reorderSteps(ctx.data.creatorID, payload.diagramID, payload.blockID, payload.stepID, payload.index);
  };
}

export default ReorderSteps;
