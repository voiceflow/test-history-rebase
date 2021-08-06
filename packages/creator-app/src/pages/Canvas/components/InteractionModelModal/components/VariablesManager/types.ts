import { VariableType } from './constants';

export interface Variable {
  id: string;
  type: VariableType;
  name: string;
}
