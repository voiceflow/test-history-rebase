import { createSelector } from 'reselect';

import * as Session from '@/ducks/session';

import { getDomainByIDSelector } from './base';

export const domainSelector = createSelector([getDomainByIDSelector, Session.activeDomainIDSelector], (getDomain, activeDomainID) =>
  getDomain({ id: activeDomainID })
);

export const topicIDsSelector = createSelector([domainSelector], (domain) => domain?.topicIDs ?? []);

export const rootDiagramIDSelector = createSelector([domainSelector], (domain) => domain?.rootDiagramID ?? null);
