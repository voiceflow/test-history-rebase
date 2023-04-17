import * as Realtime from '@voiceflow/realtime-sdk';

import { createReducer } from './utils';

const initializeReducer = createReducer(Realtime.diagram.templateCreate.done, (state, action) => {
  state.activeDiagramID = action.result.id;

  return state;
});

export default initializeReducer;
