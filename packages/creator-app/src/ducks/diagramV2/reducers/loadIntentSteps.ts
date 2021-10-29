/* eslint-disable no-param-reassign */
import * as Realtime from '@voiceflow/realtime-sdk';

import { createReducer } from './utils';

const loadIntentStepsReducer = createReducer(Realtime.diagram.loadIntentSteps, (state, { intentSteps }) => {
  state.intentSteps = intentSteps;
});

export default loadIntentStepsReducer;
