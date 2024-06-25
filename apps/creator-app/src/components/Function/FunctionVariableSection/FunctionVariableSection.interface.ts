import type { FunctionVariable } from '@voiceflow/dtos';
import type { BaseProps } from '@voiceflow/ui-next';

export interface IFunctionVariableSection extends BaseProps {
  functionVariables: FunctionVariable[];
  onFunctionVariableChange: (id: string, functionVariable: Partial<FunctionVariable>) => void;
  onFunctionVariableAdd: () => void;
  onDeleteFunctionVariable: (functionVariableID: string) => void;
  autoFocusKey: string;
  title: string;
}
