import type { ToJSON, ToObject } from '@/types';

import type { FunctionEntity } from './function.entity';

export type FunctionObject = ToObject<FunctionEntity>;
export type FunctionJSON = ToJSON<FunctionObject>;
