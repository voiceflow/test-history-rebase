/* eslint-disable no-param-reassign */
import * as Realtime from '@voiceflow/realtime-sdk';

import { unique } from '@/utils/array';
import { safeGetNormalizedByKey } from '@/utils/normalized';

import { createReducer } from './utils';

const addIntentStepsReducer = createReducer(Realtime.diagram.registerIntentSteps, (state, { diagramID, intentSteps }) => {
  if (!intentSteps.length) return;

  const diagram = safeGetNormalizedByKey(state, diagramID);

  if (diagram) {
    diagram.intentStepIDs = unique([...diagram.intentStepIDs, ...intentSteps.map(({ stepID }) => stepID)]);
  }

  state.intentSteps[diagramID] ??= {};

  Object.assign(state.intentSteps[diagramID], intentSteps);
});

export default addIntentStepsReducer;
