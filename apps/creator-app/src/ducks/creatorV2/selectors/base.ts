import { createSelector } from 'reselect';

import * as DomainSelectors from '@/ducks/domain/selectors';
import { createRootSelector } from '@/ducks/utils';

import { STATE_KEY } from '../constants';

export const creatorStateSelector = createRootSelector(STATE_KEY);

export const activeDiagramIDSelector = createSelector([creatorStateSelector], ({ activeDiagramID }) => activeDiagramID);

export const isRootDiagramActiveSelector = createSelector(
  [DomainSelectors.active.rootDiagramIDSelector, activeDiagramIDSelector],
  (rootDiagramID, activeDiagramID) => !!rootDiagramID && !!activeDiagramID && rootDiagramID === activeDiagramID
);
