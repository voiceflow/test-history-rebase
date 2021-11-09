import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Action } from 'typescript-fsa';

import { Context } from '@/types';

import { AbstractDiagramResourceControl } from '../utils';

class ReorderIntentSteps extends AbstractDiagramResourceControl<Realtime.diagram.ReorderIntentStepsPayload> {
  protected actionCreator = Realtime.diagram.reorderIntentSteps;

  protected process = async (ctx: Context, { payload }: Action<Realtime.diagram.ReorderIntentStepsPayload>) => {
    const { creatorID } = ctx.data;
    const { intentStepIDs = [] } = await this.services.diagram.get(creatorID, payload.diagramID);

    await this.services.diagram.patch(creatorID, payload.diagramID, {
      intentStepIDs: Utils.array.reorder(intentStepIDs, payload.from, payload.to),
    });
  };
}

export default ReorderIntentSteps;
