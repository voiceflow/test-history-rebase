import type { FunctionVariable } from '@voiceflow/dtos';

export interface IInputVariableEditor {
  setValue: (value: string) => void;
  variable: FunctionVariable;
  autoFocus?: boolean;
  loading: boolean;
  value: string;
}
