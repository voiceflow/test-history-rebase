import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from '../utils';
import { createViewer, getViewerKey } from './utils';

const updateViewers = createReducer(Realtime.project.awareness.loadViewers, (state, { viewers }) => {
  state.awareness.viewers = {};

  Object.entries(viewers).forEach(([projectID, projectViewers]) => {
    state.awareness.viewers[projectID] = {};

    Object.entries(projectViewers).forEach(([diagramID, diagramViewers]) => {
      state.awareness.viewers[projectID][diagramID] = Normal.normalize(diagramViewers.map(createViewer), getViewerKey);
    });
  });
});

export default updateViewers;
