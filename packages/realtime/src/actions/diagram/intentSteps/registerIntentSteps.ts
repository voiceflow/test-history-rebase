import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Action } from 'typescript-fsa';

import { Context } from '@/types';

import { AbstractDiagramResourceControl } from '../utils';

class RegisterIntentSteps extends AbstractDiagramResourceControl<Realtime.diagram.RegisterIntentStepsPayload> {
  protected actionCreator = Realtime.diagram.registerIntentSteps;

  protected process = async (ctx: Context, { payload }: Action<Realtime.diagram.RegisterIntentStepsPayload>) => {
    if (!payload.intentSteps.length) return;

    const { creatorID } = ctx.data;
    const newIntentStepIDs = payload.intentSteps.map(({ stepID }) => stepID);
    const { intentStepIDs = [] } = await this.services.diagram.get(creatorID, payload.diagramID);

    await this.services.diagram.patch(creatorID, payload.diagramID, {
      intentStepIDs: Utils.array.unique([...intentStepIDs, ...newIntentStepIDs]),
    });
  };
}

export default RegisterIntentSteps;
