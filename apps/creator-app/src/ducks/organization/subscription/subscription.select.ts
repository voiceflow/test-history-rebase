import { createSelector } from 'reselect';

import { organizationSelector } from '../organization.select';

export const chargebeeSubscriptionIDSelector = createSelector([organizationSelector], (organization) => organization?.chargebeeSubscriptionID);

export const chargebeeSubscriptionSelector = createSelector([organizationSelector], (organization) => organization?.subscription);

// TODO: [organization refactor]: change to scheduled subscription
export const chargebeeScheduledSubscriptionSelector = createSelector([organizationSelector], (organization) => organization?.subscription);
