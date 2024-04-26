import { createSelector } from 'reselect';

import { organizationSelector } from '../member/member.select';

export const chargebeeSubscriptionSelector = createSelector(
  [organizationSelector],
  (organization) => organization?.subscription
);

export const creditCardSelector = createSelector(
  [organizationSelector],
  (organization) => organization?.subscription?.paymentMethod?.card
);

export const paymentMethodSelector = createSelector(
  [organizationSelector],
  (organization) => organization?.subscription?.paymentMethod
);

export const customerIDSelector = createSelector(
  [organizationSelector],
  (organization) => organization?.subscription?.customerID
);
