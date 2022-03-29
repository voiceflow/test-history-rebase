/* eslint-disable no-param-reassign */
import * as Realtime from '@voiceflow/realtime-sdk';

import { createReducer } from '../utils';
import { createViewer } from './utils';

const updateDiagramViewers = createReducer(Realtime.project.awareness.updateViewers, (state, { diagramID, viewers }) => {
  state.awareness.viewers[diagramID] = viewers.map(createViewer);
});

export default updateDiagramViewers;
