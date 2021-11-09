import { Utils } from '@voiceflow/common';
import _uniqBy from 'lodash/uniqBy';
import { createSelector } from 'reselect';

import { creatorIDParamSelector } from '@/ducks/utils';
import { idParamSelector, idsParamSelector } from '@/ducks/utils/crudV2';

import { INITIAL_DIAGRAM_VIEWERS } from '../constants';
import { rootDiagramSelector } from './base';

export const awarenessStateSelector = createSelector([rootDiagramSelector], (state) => state.awareness);

export const awarenessViewersSelector = createSelector([awarenessStateSelector], (awareness) => awareness.viewers);

export const diagramViewersByIDSelector = createSelector([awarenessViewersSelector, idParamSelector], (awarenessViewers, diagramID) =>
  diagramID && Utils.object.hasProperty(awarenessViewers, diagramID) ? awarenessViewers[diagramID] : INITIAL_DIAGRAM_VIEWERS
);

export const diagramsViewersByIDsSelector = createSelector([awarenessViewersSelector, idsParamSelector], (awarenessViewers, diagramIDs) =>
  _uniqBy(
    diagramIDs.flatMap((diagramID) => awarenessViewers[diagramID] ?? INITIAL_DIAGRAM_VIEWERS),
    'creatorID'
  )
);

export const diagramViewersIDsByIDSelector = createSelector([diagramViewersByIDSelector], (awarenessViewers) =>
  awarenessViewers.map((viewer) => viewer.creatorID)
);

export const hasExternalDiagramViewersByIDSelector = createSelector([diagramViewersByIDSelector], (viewers) => viewers.length > 1);

export const diagramViewerByIDAndCreatorIDSelector = createSelector(
  [diagramViewersByIDSelector, creatorIDParamSelector],
  (viewers, creatorID) => viewers.find((viewer) => viewer.creatorID === creatorID) ?? null
);
