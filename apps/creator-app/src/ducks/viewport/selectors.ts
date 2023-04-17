import { createSelector } from 'reselect';

import { ZOOM_FACTOR } from '@/components/Canvas/constants';
import * as Creator from '@/ducks/creatorV2';
import { createCurriedSelector } from '@/ducks/utils';
import { createCRUDSelectors } from '@/ducks/utils/crudV2';

import { STATE_KEY } from './constants';

const { byID: _viewportByIDSelector } = createCRUDSelectors(STATE_KEY);

export const viewportByIDSelector = createSelector([_viewportByIDSelector], (viewport) => {
  if (!viewport) {
    return {
      x: 0,
      y: 0,
      zoom: ZOOM_FACTOR,
    };
  }

  return viewport;
});

export const getViewportByIDSelector = createCurriedSelector(viewportByIDSelector);

export const activeDiagramViewportSelector = createSelector(
  [Creator.activeDiagramIDSelector, getViewportByIDSelector],
  (diagramID, getViewportByID) => (diagramID ? getViewportByID({ id: diagramID }) : null)
);
