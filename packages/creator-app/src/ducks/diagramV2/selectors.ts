import _uniqBy from 'lodash/uniqBy';
import { createSelector } from 'reselect';

import { createRootSelector, creatorIDParamSelector } from '@/ducks/utils';
import { idParamSelector, idsParamSelector } from '@/ducks/utils/crudV2';
import { Nullable, Point } from '@/types';

import { INITIAL_CURSORS, INITIAL_DIAGRAM_VIEWERS, STATE_KEY } from './constants';

const rootSelector = createRootSelector(STATE_KEY);

export const awarenessStateSelector = createSelector(rootSelector, (state) => state.awareness);

export const awarenessCursorsSelector = createSelector(awarenessStateSelector, (awareness) => awareness.cursors);

export const awarenessViewersSelector = createSelector(awarenessStateSelector, (awareness) => awareness.viewers);

export const diagramCursorsByIDSelector = createSelector(awarenessCursorsSelector, idParamSelector, (awarenessCursors, diagramID) =>
  diagramID && Object.prototype.hasOwnProperty.call(awarenessCursors, diagramID) ? awarenessCursors[diagramID] : INITIAL_CURSORS
);

export const diagramViewersByIDSelector = createSelector(awarenessViewersSelector, idParamSelector, (awarenessViewers, diagramID) =>
  diagramID && Object.prototype.hasOwnProperty.call(awarenessViewers, diagramID) ? awarenessViewers[diagramID] : INITIAL_DIAGRAM_VIEWERS
);

export const diagramsViewersByIDsSelector = createSelector(awarenessViewersSelector, idsParamSelector, (awarenessViewers, diagramIDs) =>
  _uniqBy(
    diagramIDs.flatMap((diagramID) => awarenessViewers[diagramID] ?? INITIAL_DIAGRAM_VIEWERS),
    'creatorID'
  )
);

export const cursorCoordsByIDAndCreatorIDSelector = createSelector(
  diagramCursorsByIDSelector,
  creatorIDParamSelector,
  (awarenessCursors, creatorID): Nullable<Point> => awarenessCursors[creatorID] ?? null
);

export const diagramViewersIDsByIDSelector = createSelector(diagramViewersByIDSelector, (awarenessViewers) =>
  awarenessViewers.map((viewer) => viewer.creatorID)
);

export const hasExternalDiagramViewersByIDSelector = createSelector(diagramViewersByIDSelector, (viewers) => viewers.length > 1);

export const diagramViewerByIDAndCreatorIDSelector = createSelector(
  diagramViewersByIDSelector,
  creatorIDParamSelector,
  (viewers, creatorID) => viewers.find((viewer) => viewer.creatorID === creatorID) ?? null
);
