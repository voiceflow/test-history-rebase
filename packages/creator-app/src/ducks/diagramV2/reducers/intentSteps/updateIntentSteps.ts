/* eslint-disable no-param-reassign */
import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { createReducer } from '../utils';

const updateIntentStepsReducer = createReducer(Realtime.diagram.updateIntentSteps, (state, { diagramID, stepID, intent }) => {
  state.intentSteps[diagramID] ??= {};
  state.globalIntentStepMap[diagramID] ??= {};

  const previousIntentData = state.intentSteps[diagramID][stepID];

  Object.assign(state.intentSteps[diagramID], { [stepID]: intent });

  if (previousIntentData && previousIntentData.intentID) {
    state.globalIntentStepMap[diagramID][previousIntentData.intentID] ??= [];
    state.globalIntentStepMap[diagramID][previousIntentData.intentID] = Utils.array.withoutValue(
      state.globalIntentStepMap[diagramID][previousIntentData.intentID],
      stepID
    );
  }

  if (intent?.global && intent.intentID) {
    state.globalIntentStepMap[diagramID][intent.intentID] ??= [];
    state.globalIntentStepMap[diagramID][intent.intentID].push(stepID);
  }
});

export default updateIntentStepsReducer;
