import type { VariableDatatype } from '@voiceflow/dtos';

export interface IVariableDatatypeDropdown {
  value: VariableDatatype;
  error?: string | null;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  minWidth?: number;
  disabled?: boolean;
  onValueChange: (value: VariableDatatype) => void;
}
