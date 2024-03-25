import type { ToJSON, ToObject } from '@/types';

import type { FunctionPathEntity } from './function-path.entity';

export type FunctionPathObject = ToObject<FunctionPathEntity>;
export type FunctionPathJSON = ToJSON<FunctionPathObject>;
