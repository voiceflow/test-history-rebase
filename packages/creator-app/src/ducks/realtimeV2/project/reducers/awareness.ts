import * as Realtime from '@voiceflow/realtime-sdk';

import { createReducer } from './utils';

export const identifyViewerReducer = createReducer(Realtime.project.identifyViewer, (state, { projectID, tabID, viewer }) => {
  const projectState = state[projectID] || (state[projectID] = { awareness: {} });

  projectState.awareness[tabID] = viewer;
});

export const forgetViewerReducer = createReducer(Realtime.project.forgetViewer, (state, { projectID, tabID }) => {
  const projectState = state[projectID];

  if (projectState) {
    delete projectState.awareness[tabID];
  }
});
