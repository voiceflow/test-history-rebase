import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { AssistantEntity } from '@/postgres/assistant';
import { PostgresCMSObjectJSONAdapter, ref } from '@/postgres/common';
import type { CMSKeyRemap, EntityObject, ToJSONWithForeignKeys } from '@/types';

import { EventEntity } from '../../event/event.entity';
import { IntentEntity } from '../../intent/intent.entity';
import { StoryEntity } from '../story.entity';
import type { BaseTriggerEntity, EventTriggerEntity, IntentTriggerEntity } from './trigger.entity';
import { TriggerTarget } from './trigger-target.enum';

export const BaseTriggerJSONAdapter = createSmartMultiAdapter<
  EntityObject<BaseTriggerEntity>,
  ToJSONWithForeignKeys<BaseTriggerEntity>,
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

export const EventTriggerJSONAdapter = createSmartMultiAdapter<
  EntityObject<EventTriggerEntity>,
  ToJSONWithForeignKeys<EventTriggerEntity>,
  [],
  [],
  CMSKeyRemap<[['event', 'eventID'], ['story', 'storyID']]>
>(
  ({ event, target, ...data }) => ({
    ...BaseTriggerJSONAdapter.fromDB(data),

    ...(event !== undefined && { eventID: event.id }),

    ...(target !== undefined && { target: TriggerTarget.EVENT }),
  }),
  ({ target, eventID, ...data }) => ({
    ...BaseTriggerJSONAdapter.toDB(data),

    ...(eventID !== undefined &&
      data.environmentID && {
        event: ref(EventEntity, { id: eventID, environmentID: data.environmentID }),
      }),

    ...(target !== undefined && { target: TriggerTarget.EVENT }),
  })
);

export const IntentTriggerJSONAdapter = createSmartMultiAdapter<
  EntityObject<IntentTriggerEntity>,
  ToJSONWithForeignKeys<IntentTriggerEntity>,
  [],
  [],
  CMSKeyRemap<[['intent', 'intentID'], ['story', 'storyID']]>
>(
  ({ intent, target, ...data }) => ({
    ...BaseTriggerJSONAdapter.fromDB(data),

    ...(intent !== undefined && { intentID: intent.id }),

    ...(target !== undefined && { target: TriggerTarget.INTENT }),
  }),
  ({ target, intentID, ...data }) => ({
    ...BaseTriggerJSONAdapter.toDB(data),

    ...(intentID !== undefined &&
      data.environmentID && {
        intent: ref(IntentEntity, { id: intentID, environmentID: data.environmentID }),
      }),

    ...(target !== undefined && { target: TriggerTarget.INTENT }),
  })
);
