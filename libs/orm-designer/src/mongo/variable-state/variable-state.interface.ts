import type { ToJSON, ToObject } from '@/types';

import type { VariableStateEntity } from './variable-state.entity';

export type VariableStateObject = ToObject<VariableStateEntity>;
export type VariableStateJSON = ToJSON<VariableStateObject>;
