import client from '@/client';

import { EventName } from '../constants';
import { createProjectEvent, createProjectEventTracker } from '../utils';

export const trackConversationSessionStarted = createProjectEventTracker((eventInfo) =>
  client.analytics.track(createProjectEvent(EventName.CONVERSATIONS_SESSION_START, eventInfo))
);

export const trackConversationExported = createProjectEventTracker((eventInfo) =>
  client.analytics.track(createProjectEvent(EventName.CONVERSATION_EXPORT, eventInfo))
);

export const trackConversationDeleted = createProjectEventTracker((eventInfo) =>
  client.analytics.track(createProjectEvent(EventName.CONVERSATION_DELETE, eventInfo))
);

export const trackConversationNotesUpdated = createProjectEventTracker((eventInfo) =>
  client.analytics.track(createProjectEvent(EventName.CONVERSATION_NOTES_UPDATED, eventInfo))
);

export const trackConversationListFiltered = createProjectEventTracker((eventInfo) =>
  client.analytics.track(createProjectEvent(EventName.CONVERSATION_LIST_FILTERED, eventInfo))
);

export const trackConversationTagAdded = createProjectEventTracker<{ tagLabel: string }>(({ tagLabel, ...eventInfo }) =>
  client.analytics.track(createProjectEvent(EventName.CONVERSATION_TAG_ADDED, { ...eventInfo, tag_label: tagLabel }))
);

export const trackConversationTagDeleted = createProjectEventTracker((eventInfo) =>
  client.analytics.track(createProjectEvent(EventName.CONVERSATION_TAG_DELETE, eventInfo))
);

export const trackConversationUtteranceSaved = createProjectEventTracker((eventInfo) =>
  client.analytics.track(createProjectEvent(EventName.CONVERSATION_UTTERANCE_SAVE, eventInfo))
);
