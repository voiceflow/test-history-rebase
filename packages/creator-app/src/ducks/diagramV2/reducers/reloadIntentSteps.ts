/* eslint-disable no-param-reassign */
import * as Realtime from '@voiceflow/realtime-sdk';

import { createReducer } from './utils';

const reloadIntentStepsReducer = createReducer(Realtime.diagram.reloadIntentSteps, (state, { diagramID, intentSteps }) => {
  state.intentSteps[diagramID] = intentSteps;
});

export default reloadIntentStepsReducer;
