import { Actions } from '@voiceflow/sdk-logux-designer';
import * as Normal from 'normal-store';

import { createOrganizationReducer } from '../organization.utils';

export const replaceScheduledSubscriptionReducer = createOrganizationReducer(
  Actions.OrganizationSubscription.Replace,
  (state, { organizationID, subscription }) => {
    const organization = Normal.getOne(state, organizationID);

    if (!organization) return;

    if (organization.chargebeeSubscriptionID === subscription?.id) {
      // TODO: [organization refactor] replace with scheduledSubscription
      organization.subscription = subscription;
    }
  }
);

export const replaceSubscriptionReducer = createOrganizationReducer(
  Actions.OrganizationSubscription.Replace,
  (state, { organizationID, subscription }) => {
    const organization = Normal.getOne(state, organizationID);

    if (organization && organization?.chargebeeSubscriptionID === subscription?.id) {
      organization.subscription = subscription;
    }
  }
);
