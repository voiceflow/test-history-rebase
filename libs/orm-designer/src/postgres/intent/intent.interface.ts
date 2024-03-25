import type { ToJSON, ToObject } from '@/types';

import type { IntentEntity } from './intent.entity';

export type IntentObject = ToObject<IntentEntity>;
export type IntentJSON = ToJSON<IntentObject>;
