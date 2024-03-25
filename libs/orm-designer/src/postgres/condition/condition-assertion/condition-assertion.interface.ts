import type { ToJSON, ToObject } from '@/types';

import type { ConditionAssertionEntity } from './condition-assertion.entity';

export type ConditionAssertionObject = ToObject<ConditionAssertionEntity>;
export type ConditionAssertionJSON = ToJSON<ConditionAssertionObject>;
