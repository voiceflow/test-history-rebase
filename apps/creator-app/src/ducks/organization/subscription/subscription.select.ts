import { createSelector } from 'reselect';

import { ChargebeeSubscriptionStatus } from '@/models';

import { organizationSelector } from '../member/member.select';
import { getSubscriptionEntitlements } from './subscription.utils';

export const chargebeeSubscriptionSelector = createSelector(
  [organizationSelector],
  (organization) => organization?.subscription
);

export const subscriptionPlanSelector = createSelector(
  [chargebeeSubscriptionSelector],
  (subscription) => subscription?.plan
);
export const subscriptionBillingPeriodUnitSelector = createSelector(
  [chargebeeSubscriptionSelector],
  (subscription) => subscription?.billingPeriodUnit
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

export const isLockedSelector = createSelector(
  [chargebeeSubscriptionSelector],
  (subscription) => subscription?.status === ChargebeeSubscriptionStatus.CANCELLED
);

export const subscriptionEntitlementsSelector = createSelector([chargebeeSubscriptionSelector], (subscription) => {
  if (!subscription) return null;
  return getSubscriptionEntitlements(subscription);
});
