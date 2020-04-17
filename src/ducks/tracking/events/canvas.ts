import client from '@/client';

import { CanvasControlHelpMenuResource, CanvasMenuLockState, EventName } from '../constants';
import { createProjectEventPayload, createProjectEventTracker } from '../utils';

export const trackCanvasMenuLock = createProjectEventTracker<{ state: CanvasMenuLockState }>((options) =>
  client.analytics.track(EventName.CANVAS_MENU_LOCK, createProjectEventPayload(options, { state: options.state }))
);

export const trackCanvasControlHelpMenuResource = createProjectEventTracker<{ resource: CanvasControlHelpMenuResource }>((options) =>
  client.analytics.track(EventName.CANVAS_CONTROL_HELP_MENU, createProjectEventPayload(options, { resource: options.resource }))
);

export const trackCanvasControlInteractionModel = createProjectEventTracker((options) =>
  client.analytics.track(EventName.CANVAS_CONTROL_INTERACTION_MODEL, createProjectEventPayload(options))
);

export const trackCanvasSpotlightOpened = createProjectEventTracker((options) =>
  client.analytics.track(EventName.CANVAS_SPOTLIGHT_OPENED, createProjectEventPayload(options))
);
