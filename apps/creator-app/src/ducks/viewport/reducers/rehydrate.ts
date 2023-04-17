import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from './utils';

const rehydrateViewportReducer = createReducer(Realtime.diagram.viewport.rehydrate, (state, { viewport }) => {
  const localViewport = Normal.getOne(state, viewport.id);

  if (localViewport) return state;

  return Normal.appendOne(state, viewport.id, viewport);
});

export default rehydrateViewportReducer;
