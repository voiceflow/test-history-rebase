import { createSelector } from 'reselect';

import { organizationSelector } from '../member/member.select';

export const chargebeeSubscriptionIDSelector = createSelector([organizationSelector], (organization) => organization?.chargebeeSubscriptionID);

export const chargebeeSubscriptionSelector = createSelector([organizationSelector], (organization) => organization?.subscription);

export const chargebeeScheduledSubscriptionSelector = createSelector([organizationSelector], (organization) => organization?.scheduledSubscription);
