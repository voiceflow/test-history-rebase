import { createSelector } from 'reselect';

import * as Session from '@/ducks/session';

import { getDomainByIDSelector } from './base';

/**
 * @deprecated will be removed when FeatureFlag.CMS_WORKFLOWS is released
 */
export const domainSelector = createSelector(
  [getDomainByIDSelector, Session.activeDomainIDSelector],
  (getDomain, activeDomainID) => getDomain({ id: activeDomainID })
);

/**
 * @deprecated will be removed when FeatureFlag.CMS_WORKFLOWS is released
 */
export const topicIDsSelector = createSelector([domainSelector], (domain) => domain?.topicIDs ?? []);

/**
 * @deprecated will be removed when FeatureFlag.CMS_WORKFLOWS is released
 */
export const rootDiagramIDSelector = createSelector([domainSelector], (domain) => domain?.rootDiagramID ?? null);
