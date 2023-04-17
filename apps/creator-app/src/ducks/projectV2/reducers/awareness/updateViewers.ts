/* eslint-disable no-param-reassign */
import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from '../utils';
import { createViewer, getViewerKey } from './utils';

const updateViewers = createReducer(Realtime.project.awareness.updateViewers, (state, { viewers, projectID }) => {
  state.awareness.viewers[projectID] ??= {};

  Object.entries(viewers).forEach(([diagramID, diagramViewers]) => {
    state.awareness.viewers[projectID][diagramID] = Normal.normalize(diagramViewers.map(createViewer), getViewerKey);
  });
});

export default updateViewers;
