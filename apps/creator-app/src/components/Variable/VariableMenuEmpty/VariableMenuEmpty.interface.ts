import { Variable } from '@voiceflow/dtos';

export interface IVariableMenuEmpty {
  width?: number;
  onCreated?: (variable: Variable) => void;
}
