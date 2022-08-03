import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractDiagramResourceControl } from '../utils';

class RegisterIntentSteps extends AbstractDiagramResourceControl<Realtime.diagram.RegisterIntentStepsPayload> {
  protected actionCreator = Realtime.diagram.registerIntentSteps;

  protected process = async (_ctx: Context, { payload }: Action<Realtime.diagram.RegisterIntentStepsPayload>) => {
    if (!payload.intentSteps.length) return;

    const newIntentStepIDs = payload.intentSteps.map(({ stepID }) => stepID);
    const { intentStepIDs = [] } = await this.services.diagram.get(payload.diagramID);

    await this.services.diagram.patch(payload.diagramID, {
      intentStepIDs: Utils.array.unique([...intentStepIDs, ...newIntentStepIDs]),
    });
  };
}

export default RegisterIntentSteps;
