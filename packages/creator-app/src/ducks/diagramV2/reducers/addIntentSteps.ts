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

  Object.assign(state.intentSteps[diagramID], Object.fromEntries(intentSteps.map((intentStep) => [intentStep.stepID, intentStep.intentID])));
});

export default addIntentStepsReducer;
