import _uniqBy from 'lodash/uniqBy';
import { createSelector } from 'reselect';

import { Nullable, Point } from '@/types';

import { createRootSelector, firstArgSelector, secondArgSelector } from '../utils';
import { DIAGRAM_STATE_KEY, INITIAL_CURSORS, INITIAL_DIAGRAM_VIEWERS } from './constants';

const rootSelector = createRootSelector(DIAGRAM_STATE_KEY);

export const awarenessStateSelector = createSelector(rootSelector, (state) => state.awareness);

export const awarenessCursorsSelector = createSelector(awarenessStateSelector, (awareness) => awareness.cursors);

export const awarenessViewersSelector = createSelector(awarenessStateSelector, (awareness) => awareness.viewers);

export const diagramCursorsSelector = createSelector(awarenessCursorsSelector, firstArgSelector<string>(), (awarenessCursors, diagramID) =>
  Object.prototype.hasOwnProperty.call(awarenessCursors, diagramID) ? awarenessCursors[diagramID] : INITIAL_CURSORS
);

export const diagramViewersSelector = createSelector(awarenessViewersSelector, firstArgSelector<string>(), (awarenessViewers, diagramID) =>
  Object.prototype.hasOwnProperty.call(awarenessViewers, diagramID) ? awarenessViewers[diagramID] : INITIAL_DIAGRAM_VIEWERS
);

export const diagramsViewersSelector = createSelector(awarenessViewersSelector, firstArgSelector<string[]>(), (awarenessViewers, diagramIDs) =>
  _uniqBy(
    diagramIDs.flatMap((diagramID) => awarenessViewers[diagramID] ?? INITIAL_DIAGRAM_VIEWERS),
    'creatorID'
  )
);

export const cursorCoordsSelector = createSelector(
  diagramCursorsSelector,
  secondArgSelector<number>(),
  (awarenessCursors, creatorID): Nullable<Point> => awarenessCursors[creatorID] ?? null
);

export const diagramViewersIDsSelector = createSelector(diagramViewersSelector, (awarenessViewers) =>
  awarenessViewers.map((viewer) => viewer.creatorID)
);

export const hasExternalDiagramViewersSelector = createSelector(diagramViewersSelector, (viewers) => viewers.length > 1);

export const diagramHasViewerSelector = createSelector(diagramViewersSelector, secondArgSelector<number>(), (viewers, creatorID) =>
  viewers.some((viewer) => viewer.creatorID === creatorID)
);

export const diagramViewerSelector = createSelector(
  diagramViewersSelector,
  secondArgSelector<number>(),
  (viewers, creatorID) => viewers.find((viewer) => viewer.creatorID === creatorID) ?? null
);
