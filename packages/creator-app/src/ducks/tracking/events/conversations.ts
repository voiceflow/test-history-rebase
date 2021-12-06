import client from '@/client';

import { EventName } from '../constants';
import { createProjectEventPayload, createProjectEventTracker } from '../utils';

export const trackConversationSessionStarted = createProjectEventTracker((options) =>
  client.api.analytics.track(EventName.CONVERSATIONS_SESSION_START, createProjectEventPayload(options))
);

export const trackConversationExported = createProjectEventTracker((options) =>
  client.api.analytics.track(EventName.CONVERSATION_EXPORT, createProjectEventPayload(options))
);

export const trackConversationDeleted = createProjectEventTracker((options) =>
  client.api.analytics.track(EventName.CONVERSATION_DELETE, createProjectEventPayload(options))
);

export const trackConversationNotesUpdated = createProjectEventTracker((options) =>
  client.api.analytics.track(EventName.CONVERSATION_NOTES_UPDATED, createProjectEventPayload(options))
);

export const trackConversationListFiltered = createProjectEventTracker((options) =>
  client.api.analytics.track(EventName.CONVERSATION_LIST_FILTERED, createProjectEventPayload(options))
);

export const trackConversationTagAdded = createProjectEventTracker<{ tagLabel: string }>((options) =>
  client.api.analytics.track(EventName.CONVERSATION_TAG_ADDED, createProjectEventPayload(options, { tagLabel: options.tagLabel }))
);

export const trackConversationTagDeleted = createProjectEventTracker((options) =>
  client.api.analytics.track(EventName.CONVERSATION_TAG_DELETE, createProjectEventPayload(options))
);

export const trackConversationUtteranceSaved = createProjectEventTracker((options) =>
  client.api.analytics.track(EventName.CONVERSATION_UTTERANCE_SAVE, createProjectEventPayload(options))
);
