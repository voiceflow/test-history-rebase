import type { IFunctionTestResponse } from '../FunctionTest.interface';

export interface IFunctionTestSetup {
  onNext: VoidFunction;
  onClose: VoidFunction;
  functionID: string;
  onPreventClose?: VoidFunction;
  closePrevented?: boolean;
  setFunctionTestResponse: (value: IFunctionTestResponse | undefined) => void;
}
