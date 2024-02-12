import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { getViewportKey } from '../utils';
import { createReducer } from './utils';

export const updateViewportReducer = createReducer(Realtime.diagram.viewport.update, (state, { key, value }) =>
  Normal.updateOne(state, getViewportKey(key, value.versionID), value)
);
