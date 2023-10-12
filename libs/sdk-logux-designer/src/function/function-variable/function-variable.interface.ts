import type { ObjectResource } from '@/common';

import type { FunctionVariableType } from './function-variable-type.enum';

export interface FunctionVariable extends ObjectResource {
  name: string;
  description: string | null;
  type: FunctionVariableType;
  functionID: string;
  assistantID: string;
}
