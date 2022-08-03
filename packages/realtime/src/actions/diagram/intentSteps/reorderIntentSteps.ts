import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractDiagramResourceControl } from '../utils';

class ReorderIntentSteps extends AbstractDiagramResourceControl<Realtime.diagram.ReorderIntentStepsPayload> {
  protected actionCreator = Realtime.diagram.reorderIntentSteps;

  protected process = async (_ctx: Context, { payload }: Action<Realtime.diagram.ReorderIntentStepsPayload>) => {
    const { intentStepIDs = [] } = await this.services.diagram.get(payload.diagramID);

    await this.services.diagram.patch(payload.diagramID, {
      intentStepIDs: Utils.array.reorder(intentStepIDs, payload.from, payload.to),
    });
  };
}

export default ReorderIntentSteps;
