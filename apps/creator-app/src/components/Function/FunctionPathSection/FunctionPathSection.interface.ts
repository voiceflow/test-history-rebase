import type { FunctionPath } from '@voiceflow/sdk-logux-designer';

export interface IFunctionPathSection {
  functionPaths: FunctionPath[];
  onFunctionPathChange: (id: string, functionPath: Partial<FunctionPath>) => void;
  onFunctionPathAdd: () => void;
  onDeleteFunctionPath: (functionPathID: string) => void;
  title: string;
}
