/* eslint-disable no-underscore-dangle */
import { createSelector } from 'reselect';

import * as CreatorV1Selectors from '@/ducks/creator/diagram/selectors';
import * as Feature from '@/ducks/feature';
import { createRootSelector } from '@/ducks/utils';
import * as VersionV2 from '@/ducks/versionV2';

import { STATE_KEY } from '../constants';

export const creatorStateSelector = createRootSelector(STATE_KEY);

const _activeDiagramIDSelector = createSelector([creatorStateSelector], ({ activeDiagramID }) => activeDiagramID);
export const activeDiagramIDSelector = Feature.createAtomicActionsPhase2Selector([
  CreatorV1Selectors.creatorDiagramIDSelector,
  _activeDiagramIDSelector,
]);

export const isRootDiagramActiveSelector = createSelector(
  [VersionV2.active.rootDiagramIDSelector, activeDiagramIDSelector],
  (rootDiagramID, activeDiagramID) => !!rootDiagramID && !!activeDiagramID && rootDiagramID === activeDiagramID
);
