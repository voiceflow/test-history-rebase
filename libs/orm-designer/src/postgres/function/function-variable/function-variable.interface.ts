import type { ToJSON, ToObject } from '@/types';

import type { FunctionVariableEntity } from './function-variable.entity';

export type FunctionVariableObject = ToObject<FunctionVariableEntity>;
export type FunctionVariableJSON = ToJSON<FunctionVariableObject>;
