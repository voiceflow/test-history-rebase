import client from '@/client';
import { InteractionModelTabType } from '@/constants';

import { CanvasMenuLockState, EntityCreationType, EventName, IntentEditType } from '../constants';
import { createProjectEventPayload, createProjectEventTracker, createVersionEventPayload, createVersionEventTracker } from '../utils';

export const trackCanvasSeeShortcutsModalOpened = createProjectEventTracker((options) =>
  client.api.analytics.track(EventName.CANVAS_SHORTCUTS_MODAL_OPENED, createProjectEventPayload(options))
);

export const trackEntityCreated = createProjectEventTracker<{ creationType: EntityCreationType }>((options) =>
  client.api.analytics.track(EventName.ENTITY_CREATED, createProjectEventPayload(options, { creation_type: options.creationType }))
);

export const trackVersionManuallyCreated = createVersionEventTracker((options) =>
  client.api.analytics.track(EventName.VERSION_MANUALLY_CREATED, createVersionEventPayload(options))
);

export const trackCanvasMenuLock = createProjectEventTracker<{ state: CanvasMenuLockState }>((options) =>
  client.api.analytics.track(EventName.CANVAS_MENU_LOCK, createProjectEventPayload(options, { state: options.state }))
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

export const trackIMMNavigation = createProjectEventTracker<{ tabName: InteractionModelTabType }>((options) =>
  client.api.analytics.track(EventName.IMM_NAVIGATION, createProjectEventPayload(options, { tab_name: options.tabName }))
);

export const trackIntentEdit = createProjectEventTracker<{ creationType: IntentEditType }>((options) =>
  client.api.analytics.track(EventName.INTENTS_EDIT, createProjectEventPayload(options, { creation_type: options.creationType }))
);

export const trackEntityEdit = createProjectEventTracker((options) =>
  client.api.analytics.track(EventName.ENTITIES_EDIT, createProjectEventPayload(options))
);
