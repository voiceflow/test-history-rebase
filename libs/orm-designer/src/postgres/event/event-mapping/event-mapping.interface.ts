import type { ToJSON, ToObject } from '@/types';

import type { EventMappingEntity } from './event-mapping.entity';

export type EventMappingObject = ToObject<EventMappingEntity>;
export type EventMappingJSON = ToJSON<EventMappingObject>;
