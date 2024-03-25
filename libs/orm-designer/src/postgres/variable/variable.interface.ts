import type { ToJSON, ToObject } from '@/types';

import type { VariableEntity } from './variable.entity';

export type VariableObject = ToObject<VariableEntity>;
export type VariableJSON = ToJSON<VariableObject>;
