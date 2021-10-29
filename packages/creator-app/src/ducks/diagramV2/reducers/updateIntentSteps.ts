/* eslint-disable no-param-reassign */
import * as Realtime from '@voiceflow/realtime-sdk';

import { createReducer } from './utils';

const updateIntentStepsReducer = createReducer(Realtime.diagram.updateIntentSteps, (state, { diagramID, stepID, intentID }) => {
  state.intentSteps[diagramID] ??= {};

  Object.assign(state.intentSteps[diagramID], { [stepID]: intentID });
});

export default updateIntentStepsReducer;
