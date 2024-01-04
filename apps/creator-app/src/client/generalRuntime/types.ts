export interface FunctionTestRequest {
  definition: {
    code: string;
    pathCodes: string[];
    inputVars: {
      [key: string]: {
        type: string;
      };
    };
    outputVars: {
      [key: string]: {
        type: string;
      };
    };
  };
  inputMapping: { [key: string]: string };
}

export interface FunctionTestResponse {
  success: boolean;
  latencyMS: number;
  runtimeCommands: {
    outputVars?: { [key: string]: string };
    next?: { [key: string]: string };
    trace: Array<{
      type: string;
      payload: any;
    }>;
  };
}
