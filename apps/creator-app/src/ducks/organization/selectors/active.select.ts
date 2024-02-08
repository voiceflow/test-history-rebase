import * as Normal from 'normal-store';
import { createSelector } from 'reselect';

import { createCurriedSelector, creatorIDParamSelector } from '@/ducks/utils';
import { organizationIDSelector } from '@/ducks/workspaceV2/selectors/active';

import { getOrganizationByIDSelector } from './crud.select';

export const organizationSelector = createSelector([getOrganizationByIDSelector, organizationIDSelector], (getOrganizationByID, organizationID) =>
  getOrganizationByID({ id: organizationID })
);

export const membersSelector = createSelector([organizationSelector], (organization) => organization?.members);

export const normalizedMembersSelector = createSelector([membersSelector], (members) => (members ? Normal.denormalize(members) : []));

export const memberByIDSelector = createSelector([membersSelector, creatorIDParamSelector], (members, creatorID) =>
  members && creatorID !== null ? Normal.getOne(members, String(creatorID)) : null
);

export const getMemberByIDSelector = createCurriedSelector(memberByIDSelector);

export const chargebeeSubscriptionIDSelector = createSelector([organizationSelector], (organization) => organization?.chargebeeSubscriptionID);

export const chargebeeSubscriptionSelector = createSelector([organizationSelector], (organization) => organization?.subscription);
export const chargebeeScheduledSubscriptionSelector = createSelector([organizationSelector], (organization) => organization?.scheduledSubscription);
