import type { GeneralRuntimeFunctionTestResponse } from '@/client/general-runtime/general-runtime.interface';

export interface IFunctionTestResult {
  functionsTestResponse: GeneralRuntimeFunctionTestResponse;
  numInputVariables: number;
  isTraceOpened: boolean;
  isOutputVarsOpened: boolean;
  isResolvedPathOpened: boolean;
  setIsTraceOpened: (value: boolean) => void;
  setIsOutputVarsOpened: (value: boolean) => void;
  setIsResolvedPathOpened: (value: boolean) => void;
}
