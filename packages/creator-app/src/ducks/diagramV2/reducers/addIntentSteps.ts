/* eslint-disable no-param-reassign */
import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { createReducer } from './utils';

const addIntentStepsReducer = createReducer(Realtime.diagram.registerIntentSteps, (state, { diagramID, intentSteps }) => {
  if (!intentSteps.length) return;

  const diagram = Utils.normalized.safeGetNormalizedByKey(state, diagramID);

  if (diagram) {
    diagram.intentStepIDs = Utils.array.unique([...diagram.intentStepIDs, ...intentSteps.map(({ stepID }) => stepID)]);
  }

  state.intentSteps[diagramID] ??= {};

  Object.assign(state.intentSteps[diagramID], intentSteps);
});

export default addIntentStepsReducer;
