import type { FunctionVariable } from '@voiceflow/dtos';

export interface IInputVariableEditor {
  variable: FunctionVariable;
  setValue: (value: string) => void;
  value: string;
  loading: boolean;
}
