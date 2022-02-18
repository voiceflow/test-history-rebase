/* eslint-disable no-param-reassign */
import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from './utils';

const addIntentStepsReducer = createReducer(Realtime.diagram.registerIntentSteps, (state, { diagramID, intentSteps }) => {
  if (!intentSteps.length) return;

  const diagram = Normal.getOne(state, diagramID);

  if (diagram) {
    diagram.intentStepIDs = Utils.array.unique([...diagram.intentStepIDs, ...intentSteps.map(({ stepID }) => stepID)]);
  }

  state.intentSteps[diagramID] ??= {};
  state.globalIntentStepMap[diagramID] ??= {};

  intentSteps.forEach((intentStep) => {
    state.intentSteps[diagramID][intentStep.stepID] = intentStep.intent;

    if (intentStep.intent?.global) {
      state.globalIntentStepMap[diagramID][intentStep.intent.intentID] ??= [];
      state.globalIntentStepMap[diagramID][intentStep.intent.intentID].push(intentStep.stepID);
    }
  });
});

export default addIntentStepsReducer;
