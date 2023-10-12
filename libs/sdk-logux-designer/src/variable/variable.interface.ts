import type { TabularResource } from '@/common';

import type { SystemVariable } from './system-variable.enum';
import type { VariableDatatype } from './variable-datatype.enum';

export interface Variable extends TabularResource {
  datatype: VariableDatatype;
  system: SystemVariable | null;
  isArray: boolean;
  defaultValue: string | null;
  description: string | null;
  color: string;
}
