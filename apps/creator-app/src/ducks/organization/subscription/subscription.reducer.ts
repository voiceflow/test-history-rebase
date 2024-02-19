import { Actions } from '@voiceflow/sdk-logux-designer';
import * as Normal from 'normal-store';

import { createOrganizationReducer } from '../organization.utils';

export const replaceScheduledSubscriptionReducer = createOrganizationReducer(
  Actions.OrganizationSubscription.ReplaceScheduled,
  (state, { context, scheduledSubscription }) => {
    const { organizationID } = context;
    const organization = Normal.getOne(state, organizationID);

    if (!organization) return;

    if (organization.chargebeeSubscriptionID === scheduledSubscription?.id) {
      organization.scheduledSubscription = scheduledSubscription;
    }
  }
);

export const replaceSubscriptionReducer = createOrganizationReducer(Actions.OrganizationSubscription.Replace, (state, { context, subscription }) => {
  const { organizationID } = context;
  const organization = Normal.getOne(state, organizationID);

  if (organization && organization?.chargebeeSubscriptionID === subscription?.id) {
    organization.subscription = subscription;
  }
});
