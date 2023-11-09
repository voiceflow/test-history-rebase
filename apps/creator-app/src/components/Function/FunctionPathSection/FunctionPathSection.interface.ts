import type { FunctionPath } from '@voiceflow/dtos';

export interface IFunctionPathSection {
  functionPaths: FunctionPath[];
  onFunctionPathChange: (id: string, functionPath: Partial<FunctionPath>) => void;
  onFunctionPathAdd: () => void;
  onDeleteFunctionPath: (functionPathID: string) => void;
  title: string;
}
