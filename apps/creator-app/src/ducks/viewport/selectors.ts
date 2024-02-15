import { getOne } from 'normal-store';
import { createSelector } from 'reselect';

import * as Creator from '@/ducks/creatorV2';
import { activeVersionIDSelector } from '@/ducks/session/selectors';
import { createCurriedSelector, createRootSelector, diagramIDParamSelector } from '@/ducks/utils';

import { STATE_KEY } from './constants';
import { getViewportKey } from './utils';

const rootSelector = createRootSelector(STATE_KEY);

export const viewportByDiagramIDSelector = createSelector(
  [rootSelector, activeVersionIDSelector, diagramIDParamSelector],
  (state, versionID, diagramID) => {
    if (!versionID || !diagramID) return null;

    return getOne(state, getViewportKey(diagramID, versionID));
  }
);

export const getViewportByDiagramIDSelector = createCurriedSelector(viewportByDiagramIDSelector);

export const activeDiagramViewportSelector = createSelector(
  [Creator.activeDiagramIDSelector, getViewportByDiagramIDSelector],
  (diagramID, getViewportByID) => (diagramID ? getViewportByID({ diagramID }) : null)
);
