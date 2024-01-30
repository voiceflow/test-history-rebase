import type { Variable } from '@voiceflow/dtos';

export interface IVariableMenu {
  width?: number;
  onClose: VoidFunction;
  onSelect: (variable: Variable) => void;
  excludeVariableIDs?: string[];
}
