import type { ObjectResource } from '@/common';

import type { FunctionVariableType } from './function-variable-type.enum';

export interface FunctionVariable extends ObjectResource {
  name: string;
  type: FunctionVariableType;
  functionID: string;
  description: string | null;
  assistantID: string;
  environmentID: string;
}
