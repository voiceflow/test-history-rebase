export interface IFunctionTestModal {
  functionID: string;
}

export interface IFunctionTestResponse {
  status: string;
  latencyMS: number;
  outputMapping: Record<string, any>;
}
