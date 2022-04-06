/* eslint-disable no-param-reassign */
import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from '../utils';
import { createViewer, getViewerKey } from './utils';

const loadViewers = createReducer(Realtime.project.awareness.loadViewers, (state, { viewers }) => {
  Object.entries(viewers).forEach(([diagramID, diagramViewers]) => {
    state.awareness.viewers[diagramID] = Normal.normalize(diagramViewers.map(createViewer), getViewerKey);
  });
});

export default loadViewers;
