import client from '@/client';
import { EventName } from '@/ducks/tracking/constants';

import { createBaseEvent, createBaseEventTracker } from '../utils';

export const trackProfileNameChanged = createBaseEventTracker((eventInfo) =>
  client.analytics.track(createBaseEvent(EventName.PROFILE_NAME_CHANGED, eventInfo))
);

export const trackProfileEmailChanged = createBaseEventTracker((eventInfo) =>
  client.analytics.track(createBaseEvent(EventName.PROFILE_EMAIL_CHANGED, eventInfo))
);

export const trackProfilePasswordChanged = createBaseEventTracker((eventInfo) =>
  client.analytics.track(createBaseEvent(EventName.PROFILE_PASSWORD_CHANGED, eventInfo))
);
