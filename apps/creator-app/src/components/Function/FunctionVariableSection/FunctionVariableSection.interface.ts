import type { FunctionVariable } from '@voiceflow/dtos';

export interface IFunctionVariableSection {
  functionVariables: FunctionVariable[];
  onFunctionVariableChange: (id: string, functionVariable: Partial<FunctionVariable>) => void;
  onFunctionVariableAdd: () => void;
  onDeleteFunctionVariable: (functionVariableID: string) => void;
  autoFocusKey: string;
  title: string;
  testID: string;
}
