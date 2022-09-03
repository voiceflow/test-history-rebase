import { createSelector } from 'reselect';

import { createCRUDSelectors } from '@/ducks/utils/crudV2';
import { createCurriedSelector, createParameterSelector } from '@/ducks/utils/selector';
import { rootDiagramIDSelector } from '@/ducks/versionV2/selectors/active';
import { findDomainIDByTopicID, findRootDomainID } from '@/utils/domain';

import { STATE_KEY } from '../constants';

const topicIDSelector = createParameterSelector((params: { topicID: string }) => params.topicID);

export const {
  all: allDomainsSelector,
  map: domainsMapSelector,
  byID: domainByIDSelector,
  byIDs: domainsByIDsSelector,
  allIDs: allDomainIDsSelector,
} = createCRUDSelectors(STATE_KEY);

export const getDomainByIDSelector = createCurriedSelector(domainByIDSelector);

export const rootDomainIDSelector = createSelector([allDomainsSelector, rootDiagramIDSelector], (domains, rootDiagramID) =>
  rootDiagramID ? findRootDomainID(domains, rootDiagramID) : null
);

export const rootDomainSelector = createSelector([getDomainByIDSelector, rootDomainIDSelector], (getDomainByID, rootDiagramID) =>
  getDomainByID({ id: rootDiagramID })
);

export const domainIDByTopicIDSelector = createSelector([allDomainsSelector, topicIDSelector], (domains, topicID) =>
  findDomainIDByTopicID(domains, topicID)
);

export const getDomainIDByTopicIDSelector = createCurriedSelector(domainIDByTopicIDSelector);
