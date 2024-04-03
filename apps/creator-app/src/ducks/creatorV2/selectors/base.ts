import { FeatureFlag } from '@voiceflow/realtime-sdk';
import { createSelector } from 'reselect';

import * as DomainSelectors from '@/ducks/domain/selectors';
import * as Feature from '@/ducks/feature';
import { createRootSelector } from '@/ducks/utils';
import { rootDiagramIDSelector } from '@/ducks/versionV2/selectors/active';

import { STATE_KEY } from '../constants';

export const creatorStateSelector = createRootSelector(STATE_KEY);

export const activeDiagramIDSelector = createSelector([creatorStateSelector], ({ activeDiagramID }) => activeDiagramID);

export const isRootDiagramActiveSelector = createSelector(
  [DomainSelectors.active.rootDiagramIDSelector, activeDiagramIDSelector, rootDiagramIDSelector, Feature.isFeatureEnabledSelector],
  (domainRootDiagramID, activeDiagramID, versionRootDiagramID, isFeatureEnabled) =>
    isFeatureEnabled(FeatureFlag.CMS_WORKFLOWS)
      ? !!versionRootDiagramID && !!activeDiagramID && versionRootDiagramID === activeDiagramID
      : !!domainRootDiagramID && !!activeDiagramID && domainRootDiagramID === activeDiagramID
);
