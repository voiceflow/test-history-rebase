import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { getViewportKey } from '../utils';
import { createReducer } from './utils';

export const rehydrateViewportReducer = createReducer(Realtime.diagram.viewport.rehydrate, (state, { viewport }) => {
  const key = getViewportKey(viewport.id, viewport.versionID);

  const localViewport = Normal.getOne(state, key);

  if (localViewport) return state;

  return Normal.appendOne(state, key, viewport);
});
