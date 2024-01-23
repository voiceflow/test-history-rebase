import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from './utils';

const replaceSubscriptionReducer = createReducer(Realtime.organization.replaceSubscription, (state, { organizationID, subscription }) => {
  const organization = Normal.getOne(state, organizationID);

  if (organization && organization?.chargebeeSubscriptionID === subscription?.id) {
    organization.subscription = subscription;
  }
});

export default replaceSubscriptionReducer;
