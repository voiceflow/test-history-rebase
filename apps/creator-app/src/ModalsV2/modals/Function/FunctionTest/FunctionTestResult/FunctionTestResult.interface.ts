import { FunctionTestResponse } from '@/client/generalRuntime/types';

export interface IFunctionTestResult {
  functionsTestResponse: FunctionTestResponse;
  numInputVariables: number;
  isTraceOpened: boolean;
  isOutputVarsOpened: boolean;
  isResolvedPathOpened: boolean;
  setIsTraceOpened: (value: boolean) => void;
  setIsOutputVarsOpened: (value: boolean) => void;
  setIsResolvedPathOpened: (value: boolean) => void;
}
