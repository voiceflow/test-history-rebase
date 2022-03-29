/* eslint-disable no-param-reassign */
import * as Realtime from '@voiceflow/realtime-sdk';

import { createReducer } from '../utils';
import { createViewer } from './utils';

const loadViewersReducer = createReducer(Realtime.project.awareness.loadViewers, (state, { viewers }) => {
  Object.keys(viewers).forEach((diagramID) => {
    state.awareness.viewers[diagramID] = viewers[diagramID].map(createViewer);
  });
});

export default loadViewersReducer;
