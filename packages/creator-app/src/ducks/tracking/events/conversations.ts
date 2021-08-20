import client from '@/client';

import { EventName } from '../constants';
import { ConversationsEventInfo } from '../types';
import { createConversationsEventPayload, createConversationsEventTracker } from '../utils';

export const trackConversationSessionStarted = createConversationsEventTracker((options: ConversationsEventInfo) =>
  client.analytics.track(EventName.CONVERSATIONS_SESSION_START, createConversationsEventPayload(options))
);

export const trackConversationExported = createConversationsEventTracker((options: ConversationsEventInfo) =>
  client.analytics.track(EventName.CONVERSATION_EXPORT, createConversationsEventPayload(options))
);

export const trackConversationDeleted = createConversationsEventTracker((options: ConversationsEventInfo) =>
  client.analytics.track(EventName.CONVERSATION_DELETE, createConversationsEventPayload(options))
);

export const trackConversationNotesUpdated = createConversationsEventTracker((options: ConversationsEventInfo) =>
  client.analytics.track(EventName.CONVERSATION_NOTES_UPDATED, createConversationsEventPayload(options))
);

export const trackConversationListFiltered = createConversationsEventTracker((options: ConversationsEventInfo) =>
  client.analytics.track(EventName.CONVERSATION_LIST_FILTERED, createConversationsEventPayload(options))
);

export const trackConversationTagAdded = createConversationsEventTracker<{ tagLabel: string }>((options) =>
  client.analytics.track(EventName.CONVERSATION_TAG_ADDED, createConversationsEventPayload(options, { tagLabel: options.tagLabel }))
);

export const trackConversationTagDeleted = createConversationsEventTracker((options: ConversationsEventInfo) =>
  client.analytics.track(EventName.CONVERSATION_TAG_DELETE, createConversationsEventPayload(options))
);

export const trackConversationUtteranceSaved = createConversationsEventTracker((options: ConversationsEventInfo) =>
  client.analytics.track(EventName.CONVERSATION_UTTERANCE_SAVE, createConversationsEventPayload(options))
);
