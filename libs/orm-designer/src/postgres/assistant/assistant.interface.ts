import type { ToJSON, ToObject } from '@/types';

import type { AssistantEntity } from './assistant.entity';

export type AssistantObject = ToObject<AssistantEntity>;
export type AssistantJSON = ToJSON<AssistantObject>;
