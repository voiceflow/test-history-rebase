import type { IFunctionTestResponse } from '../FunctionTest.interface';

export interface IFunctionTestResult {
  onNext: VoidFunction;
  onClose: VoidFunction;
  functionID: string;
  functionTestResponse?: IFunctionTestResponse;
}
