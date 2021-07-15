import { createSelector } from 'reselect';

import { createEmptyNormalized } from '@/utils/normalized';

import { createRootSelector } from '../utils';
import { DIAGRAM_STATE_KEY } from './constants';

const rootSelector = createRootSelector(DIAGRAM_STATE_KEY);

export const diagramStateSelector = createSelector(
  [rootSelector],
  (state) => (diagramID: string) => Object.prototype.hasOwnProperty.call(state, diagramID) ? state[diagramID] : null
);

export const diagramAwarenessSelector = createSelector([diagramStateSelector], (getDiagramState) => (diagramID: string) => {
  const diagramState = getDiagramState(diagramID);

  return diagramState ? diagramState.awareness : createEmptyNormalized();
});

export const diagramViewersTabIDsSelector = createSelector(
  [diagramAwarenessSelector],
  (getDiagramAwareness) => (diagramID: string) => getDiagramAwareness(diagramID).allKeys
);

export const cursorCoordsSelector = createSelector([diagramAwarenessSelector], (getDiagramAwareness) => (diagramID: string, tabID: string) => {
  const awareness = getDiagramAwareness(diagramID);

  return awareness.byKey[tabID] ?? null;
});
