import type { FunctionVariable } from '@voiceflow/sdk-logux-designer';

export interface IFunctionVariableSection {
  functionVariables: FunctionVariable[];
  onFunctionVariableChange: (id: string, functionVariable: Partial<FunctionVariable>) => void;
  onFunctionVariableAdd: () => void;
  onDeleteFunctionVariable: (functionVariableID: string) => void;
  title: string;
}
