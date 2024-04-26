/* eslint-disable no-param-reassign */
import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from '../utils';
import { createViewer, getViewerKey } from './utils';

const updateDiagramViewers = createReducer(
  Realtime.project.awareness.updateDiagramViewers,
  (state, { viewers, diagramID, projectID }) => {
    state.awareness.viewers[projectID] ??= {};

    state.awareness.viewers[projectID][diagramID] = Normal.normalize(viewers.map(createViewer), getViewerKey);
  }
);

export default updateDiagramViewers;
