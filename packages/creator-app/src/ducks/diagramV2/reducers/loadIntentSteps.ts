/* eslint-disable no-param-reassign */
import * as Realtime from '@voiceflow/realtime-sdk';

import { createReducer } from './utils';

const loadIntentStepsReducer = createReducer(Realtime.diagram.loadIntentSteps, (state, { intentSteps }) => {
  state.intentSteps = intentSteps;

  state.globalIntentStepMap = Object.fromEntries(
    Object.entries(intentSteps).map(([diagramID, diagramIntentSteps]) => [
      diagramID,
      Object.keys(diagramIntentSteps).reduce<Record<string, string[]>>((acc2, stepID) => {
        const intentData = diagramIntentSteps[stepID];

        if (intentData?.global) {
          acc2[intentData.intentID] ??= [];
          acc2[intentData.intentID].push(stepID);
        }

        return acc2;
      }, {}),
    ])
  );
});

export default loadIntentStepsReducer;
