import client from '@/client';

import { CanvasMenuLockState, EventName } from '../constants';
import { createProjectEventPayload, createProjectEventTracker, createVersionEventPayload, createVersionEventTracker } from '../utils';

export const trackCanvasSeeShortcutsModalOpened = createProjectEventTracker((options) =>
  client.api.analytics.track(EventName.CANVAS_SHORTCUTS_MODAL_OPENED, createProjectEventPayload(options))
);

export const trackCanvasMenuLock = createVersionEventTracker<{ state: CanvasMenuLockState }>((options) =>
  client.api.analytics.track(EventName.CANVAS_MENU_LOCK, createVersionEventPayload(options, { state: options.state }))
);

export const trackCanvasControlHelpMenuResource = createVersionEventTracker<{ resource: string }>((options) =>
  client.api.analytics.track(EventName.CANVAS_CONTROL_HELP_MENU, createVersionEventPayload(options, { resource: options.resource }))
);

export const trackCanvasControlInteractionModel = createVersionEventTracker((options) =>
  client.api.analytics.track(EventName.CANVAS_CONTROL_INTERACTION_MODEL, createVersionEventPayload(options))
);

export const trackCanvasSpotlightOpened = createVersionEventTracker((options) =>
  client.api.analytics.track(EventName.CANVAS_SPOTLIGHT_OPENED, createVersionEventPayload(options))
);

export const trackMarkupText = createVersionEventTracker((options) =>
  client.api.analytics.track(EventName.CANVAS_MARKUP_TEXT, createVersionEventPayload(options))
);

export const trackMarkupImage = createVersionEventTracker((options) =>
  client.api.analytics.track(EventName.CANVAS_MARKUP_IMAGE, createVersionEventPayload(options))
);

export const trackCommentingOpen = createVersionEventTracker((options) =>
  client.api.analytics.track(EventName.CANVAS_COMMENTING_OPENED, createVersionEventPayload(options))
);

export const trackNewThreadCreated = createVersionEventTracker((options) =>
  client.api.analytics.track(EventName.PROJECT_NEW_COMMENT_THREAD, createVersionEventPayload(options))
);

export const trackNewThreadReply = createVersionEventTracker((options) =>
  client.api.analytics.track(EventName.PROJECT_NEW_THREAD_REPLY, createVersionEventPayload(options))
);
