import { createSelector } from 'reselect';

import { createRootSelector } from '@/ducks/utils';
import * as VersionV2 from '@/ducks/versionV2';

import { STATE_KEY } from '../constants';

export const creatorStateSelector = createRootSelector(STATE_KEY);

export const activeDiagramIDSelector = createSelector([creatorStateSelector], ({ activeDiagramID }) => activeDiagramID);

export const isRootDiagramActiveSelector = createSelector(
  [VersionV2.active.rootDiagramIDSelector, activeDiagramIDSelector],
  (rootDiagramID, activeDiagramID) => !!rootDiagramID && !!activeDiagramID && rootDiagramID === activeDiagramID
);
