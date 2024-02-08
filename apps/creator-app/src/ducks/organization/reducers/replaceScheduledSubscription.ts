import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from './utils';

const replaceScheduledSubscriptionReducer = createReducer(
  Realtime.organization.replaceScheduledSubscription,
  (state, { organizationID, subscription }) => {
    const organization = Normal.getOne(state, organizationID);

    if (!organization) return;

    if (organization.chargebeeSubscriptionID === subscription?.id) {
      organization.scheduledSubscription = subscription;
    }
  }
);

export default replaceScheduledSubscriptionReducer;
