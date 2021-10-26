/* eslint-disable no-param-reassign */
import * as Realtime from '@voiceflow/realtime-sdk';
import { getAlternativeColor } from '@voiceflow/ui';

import { createReducer } from './utils';

const createViewer = (viewer: Realtime.Viewer) => ({ ...viewer, color: getAlternativeColor(viewer.creatorID), creator_id: viewer.creatorID });

export const updateDiagramViewers = createReducer(Realtime.project.awareness.updateViewers, (state, { diagramID, viewers }) => {
  state.awareness.viewers[diagramID] = viewers.map(createViewer);
});

export const loadViewersReducer = createReducer(Realtime.project.awareness.loadViewers, (state, { viewers }) => {
  Object.keys(viewers).forEach((diagramID) => {
    state.awareness.viewers[diagramID] = viewers[diagramID].map(createViewer);
  });
});
