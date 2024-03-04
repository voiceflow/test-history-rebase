import { createSelector } from 'reselect';

import { organizationSelector } from '../member/member.select';

export const chargebeeSubscriptionSelector = createSelector([organizationSelector], (organization) => organization?.subscription);
