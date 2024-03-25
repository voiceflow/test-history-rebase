import type { ToJSON, ToObject } from '@/types';

import type { EventEntity } from './event.entity';

export type EventObject = ToObject<EventEntity>;
export type EventJSON = ToJSON<EventObject>;
