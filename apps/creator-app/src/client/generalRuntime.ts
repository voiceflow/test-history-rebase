// import axios from 'axios';

// import { GENERAL_RUNTIME_CLOUD_ENDPOINT } from '@/config';

// import { AUTH_HEADERS } from './constant';

export interface FunctionDataRequest {
  functionDefinition: {
    code: string;
    pathCodes: string[];
    inputVars: {
      [key: string]: {
        [key: string]: string;
      };
    };
    outputVars: {
      [key: string]: {
        [key: string]: string;
      };
    };
  };
  inputMapping: { [key: string]: string };
}

export interface FunctionDataResponse {
  success: boolean;
  latencyMS: number;
  runtimeCommands: {
    outputVars: { [key: string]: string };
    next: { [key: string]: string };
    trace: Array<{
      type: string;
      payload: any;
    }>;
  };
}

// export const testFunction = (functionData: FunctionDataRequest): Promise<FunctionDataResponse> =>
//   axios
//     .post<FunctionDataRequest, { data: FunctionDataResponse }>(`${GENERAL_RUNTIME_CLOUD_ENDPOINT}/test/functions`, functionData, {
//       headers: AUTH_HEADERS,
//     })
//     .then((response) => response.data);

export const testFunction = (_: FunctionDataRequest): Promise<FunctionDataResponse> =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        latencyMS: 329.846959002316,
        runtimeCommands: {
          outputVars: {
            outVarA: 'lightning-rod',
          },
          next: {
            path: 'path-a',
          },
          trace: [
            {
              type: 'debug',
              payload: {
                message: 'debug message',
              },
            },
            {
              type: 'text',
              payload: {
                message: 'This is text trace',
              },
            },
          ],
        },
      });
    }, 4000);
  });
