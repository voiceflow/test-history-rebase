/* eslint-disable no-param-reassign */
import * as Realtime from '@voiceflow/realtime-sdk';

import { createReducer } from '../utils';

const removeDiagram = createReducer(Realtime.diagram.crud.remove, (state, { key }) => {
  delete state.intentSteps[key];
  delete state.globalIntentStepMap[key];
});

export default removeDiagram;
