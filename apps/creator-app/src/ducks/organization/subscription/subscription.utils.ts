import type { Subscription } from '@voiceflow/dtos';
import { SubscriptionStatus } from '@voiceflow/dtos';

export const getSubscriptionEntitlements = (subscription: Subscription) => {
  if (subscription.status !== SubscriptionStatus.CANCELLED) return subscription.entitlements;

  return {
    ...subscription.entitlements,
    // FIXME: replace hardcoded values by dynamic values fetched from plans.
    agentsLimit: 2,
    workspacesLimit: 1,
  };
};
