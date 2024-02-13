import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { AssistantEntity } from '@/postgres/assistant';
import { PostgresCMSObjectJSONAdapter, ref } from '@/postgres/common';
import type { CMSKeyRemap, EntityObject, ToJSONWithForeignKeys } from '@/types';

import { EventEntity } from '../../event/event.entity';
import { IntentEntity } from '../../intent/intent.entity';
import { StoryEntity } from '../story.entity';
import type { BaseStoryTriggerEntity, EventStoryTriggerEntity, IntentStoryTriggerEntity } from './story-trigger.entity';
import { StoryTriggerTarget } from './story-trigger-target.enum';

export const BaseStoryTriggerJSONAdapter = createSmartMultiAdapter<
  EntityObject<BaseStoryTriggerEntity>,
  ToJSONWithForeignKeys<BaseStoryTriggerEntity>,
  [],
  [],
  CMSKeyRemap<[['story', 'storyID']]>
>(
  ({ story, assistant, ...data }) => ({
    ...PostgresCMSObjectJSONAdapter.fromDB(data),

    ...(story !== undefined && { storyID: story.id }),

    ...(assistant !== undefined && { assistantID: assistant.id }),
  }),
  ({ storyID, assistantID, environmentID, ...data }) => ({
    ...PostgresCMSObjectJSONAdapter.toDB(data),

    ...(assistantID !== undefined && { assistant: ref(AssistantEntity, assistantID) }),

    ...(environmentID !== undefined && {
      environmentID,

      ...(storyID !== undefined && {
        story: ref(StoryEntity, { id: storyID, environmentID }),
      }),
    }),
  })
);

export const EventStoryTriggerJSONAdapter = createSmartMultiAdapter<
  EntityObject<EventStoryTriggerEntity>,
  ToJSONWithForeignKeys<EventStoryTriggerEntity>,
  [],
  [],
  CMSKeyRemap<[['event', 'eventID'], ['story', 'storyID']]>
>(
  ({ event, target, ...data }) => ({
    ...BaseStoryTriggerJSONAdapter.fromDB(data),

    ...(event !== undefined && { eventID: event.id }),

    ...(target !== undefined && { target: StoryTriggerTarget.EVENT }),
  }),
  ({ target, eventID, ...data }) => ({
    ...BaseStoryTriggerJSONAdapter.toDB(data),

    ...(eventID !== undefined &&
      data.environmentID && {
        event: ref(EventEntity, { id: eventID, environmentID: data.environmentID }),
      }),

    ...(target !== undefined && { target: StoryTriggerTarget.EVENT }),
  })
);

export const IntentStoryTriggerJSONAdapter = createSmartMultiAdapter<
  EntityObject<IntentStoryTriggerEntity>,
  ToJSONWithForeignKeys<IntentStoryTriggerEntity>,
  [],
  [],
  CMSKeyRemap<[['intent', 'intentID'], ['story', 'storyID']]>
>(
  ({ intent, target, ...data }) => ({
    ...BaseStoryTriggerJSONAdapter.fromDB(data),

    ...(intent !== undefined && { intentID: intent.id }),

    ...(target !== undefined && { target: StoryTriggerTarget.INTENT }),
  }),
  ({ target, intentID, ...data }) => ({
    ...BaseStoryTriggerJSONAdapter.toDB(data),

    ...(intentID !== undefined &&
      data.environmentID && {
        intent: ref(IntentEntity, { id: intentID, environmentID: data.environmentID }),
      }),

    ...(target !== undefined && { target: StoryTriggerTarget.INTENT }),
  })
);
