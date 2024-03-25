import type { ToJSON, ToObject } from '@/types';

import type { BaseStoryTriggerEntity, EventStoryTriggerEntity, IntentStoryTriggerEntity } from './story-trigger.entity';

export type BaseStoryTriggerObject = ToObject<BaseStoryTriggerEntity>;
export type BaseStoryTriggerJSON = ToJSON<BaseStoryTriggerObject>;

export type EventStoryTriggerObject = ToObject<EventStoryTriggerEntity>;
export type EventStoryTriggerJSON = ToJSON<EventStoryTriggerObject>;

export type IntentStoryTriggerObject = ToObject<IntentStoryTriggerEntity>;
export type IntentStoryTriggerJSON = ToJSON<IntentStoryTriggerObject>;

export type AnyStoryTriggerJSON = EventStoryTriggerJSON | IntentStoryTriggerJSON;
export type AnyStoryTriggerObject = EventStoryTriggerObject | IntentStoryTriggerJSON;
export type AnyStoryTriggerEntity = EventStoryTriggerEntity | IntentStoryTriggerEntity;
