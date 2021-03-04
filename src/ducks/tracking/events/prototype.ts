import client from '@/client';
import { PrototypeLayout, PrototypeMode } from '@/ducks/prototype/types';

import { EventName } from '../constants';
import { ProjectEventInfo } from '../types';
import { createProjectEventPayload, createProjectEventTracker } from '../utils';

export const trackPrototypeManualNavForwardButton = createProjectEventTracker((options: ProjectEventInfo) =>
  client.analytics.track(EventName.PROTOTYPE_MANUAL_NAVIGATION, createProjectEventPayload(options, { direction: 'forward' }))
);

export const trackPrototypeManualNavBackwardButton = createProjectEventTracker((options: ProjectEventInfo) =>
  client.analytics.track(EventName.PROTOTYPE_MANUAL_NAVIGATION, createProjectEventPayload(options, { direction: 'backward' }))
);

export const trackProjectTrainAssistant = createProjectEventTracker((options) =>
  client.analytics.track(EventName.PROJECT_TRAIN_ASSISTANT, createProjectEventPayload(options))
);

export const trackActiveProjectPrototypeTestClick = createProjectEventTracker((options) =>
  client.analytics.track(EventName.PROJECT_PROTOTYPE_TEST_CLICK, createProjectEventPayload(options))
);

export const trackActiveProjectPrototypeTestStart = createProjectEventTracker<{ debug: boolean; display: string | null; mode: PrototypeMode }>(
  (options) =>
    client.analytics.track(
      EventName.PROJECT_PROTOTYPE_TEST_START,
      createProjectEventPayload(options, { debug: options.debug, display: options.display, mode: options.mode })
    )
);

export const trackPrototypeShareViewSession = createProjectEventTracker<{ layout: PrototypeLayout; isMobile: boolean }>((options) =>
  client.analytics.track(
    EventName.PROTOTYPE_SHARE_VIEW_SESSION,
    createProjectEventPayload(options, { layout: options.layout, device: options.isMobile ? 'Mobile or Tablet' : 'Desktop' })
  )
);
