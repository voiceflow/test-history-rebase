import client from '@/client';
import { EventName } from '@/ducks/tracking/constants';

import { createWorkspaceEvent, createWorkspaceEventTracker } from '../utils';

export const trackTrialExpiredDowngrade = createWorkspaceEventTracker((eventInfo) =>
  client.analytics.track(createWorkspaceEvent(EventName.PRO_TRIAL_EXPIRED_DOWNGRADE, eventInfo))
);

export const trackTrialExpiredUpgrade = createWorkspaceEventTracker<{ editorSeats: number }>((eventInfo) =>
  client.analytics.track(createWorkspaceEvent(EventName.PRO_TRIAL_EXPIRED_UPGRADE, eventInfo))
);
