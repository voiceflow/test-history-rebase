import axios from 'axios';

import { GENERAL_RUNTIME_ENDPOINT } from '@/config';

import { AUTH_HEADERS } from '../constant';
import { FunctionTestRequest, FunctionTestResponse } from './types';

export const testFunction = (functionData: FunctionTestRequest): Promise<FunctionTestResponse> =>
  axios
    .post<FunctionTestRequest, { data: FunctionTestResponse }>(`${GENERAL_RUNTIME_ENDPOINT}/test/functions`, functionData, {
      headers: AUTH_HEADERS,
    })
    .then((response) => response.data);
