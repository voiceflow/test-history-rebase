import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { PostgresCMSObjectJSONAdapter } from '@/postgres/common';

import type {
  BaseStoryTriggerJSON,
  BaseStoryTriggerObject,
  EventStoryTriggerJSON,
  EventStoryTriggerObject,
  IntentStoryTriggerJSON,
  IntentStoryTriggerObject,
} from './story-trigger.interface';

export const BaseStoryTriggerJSONAdapter = createSmartMultiAdapter<BaseStoryTriggerObject, BaseStoryTriggerJSON>(
  PostgresCMSObjectJSONAdapter.fromDB,
  PostgresCMSObjectJSONAdapter.toDB
);

export const EventStoryTriggerJSONAdapter = createSmartMultiAdapter<EventStoryTriggerObject, EventStoryTriggerJSON>(
  ({ target, ...data }) => ({
    ...BaseStoryTriggerJSONAdapter.fromDB(data),

    ...(target !== undefined && { target }),
  }),
  ({ target, ...data }) => ({
    ...BaseStoryTriggerJSONAdapter.toDB(data),

    ...(target !== undefined && { target }),
  })
);

export const IntentStoryTriggerJSONAdapter = createSmartMultiAdapter<IntentStoryTriggerObject, IntentStoryTriggerJSON>(
  ({ target, ...data }) => ({
    ...BaseStoryTriggerJSONAdapter.fromDB(data),

    ...(target !== undefined && { target }),
  }),
  ({ target, ...data }) => ({
    ...BaseStoryTriggerJSONAdapter.toDB(data),

    ...(target !== undefined && { target }),
  })
);
