/* eslint-disable no-param-reassign */
import * as Realtime from '@voiceflow/realtime-sdk';

import { createReducer } from '../utils';

const reloadIntentStepsReducer = createReducer(Realtime.diagram.reloadIntentSteps, (state, { diagramID, intentSteps }) => {
  state.intentSteps[diagramID] = intentSteps;
  state.globalIntentStepMap[diagramID] = Object.keys(intentSteps).reduce<Record<string, string[]>>((acc, stepID) => {
    const intentData = intentSteps[stepID];

    if (intentData?.global && intentData.intentID) {
      acc[intentData.intentID] ??= [];
      acc[intentData.intentID].push(stepID);
    }

    return acc;
  }, {});
});

export default reloadIntentStepsReducer;
