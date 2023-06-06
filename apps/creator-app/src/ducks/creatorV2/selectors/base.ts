import { createSelector } from 'reselect';

import { createRootSelector } from '@/ducks/utils';
import { rootDiagramIDSelector } from '@/ducks/versionV2/selectors/active';

import { STATE_KEY } from '../constants';

export const creatorStateSelector = createRootSelector(STATE_KEY);

export const activeDiagramIDSelector = createSelector([creatorStateSelector], ({ activeDiagramID }) => activeDiagramID);

export const isRootDiagramActiveSelector = createSelector(
  [rootDiagramIDSelector, activeDiagramIDSelector],
  (rootDiagramID, activeDiagramID) => !!rootDiagramID && !!activeDiagramID && rootDiagramID === activeDiagramID
);
