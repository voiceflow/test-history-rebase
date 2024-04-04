import axios from 'axios';

import { GENERAL_RUNTIME_ENDPOINT } from '@/config';

import { AUTH_HEADERS } from '../constant';
import {
  GeneralRuntimeFunctionTestRequest,
  GeneralRuntimeFunctionTestResponse,
  GeneralRuntimeIntentPreviewUtteranceRequest,
  GeneralRuntimeIntentPreviewUtteranceResponse,
} from './general-runtime.interface';

const axiosInstance = axios.create({
  baseURL: GENERAL_RUNTIME_ENDPOINT,
});

axiosInstance.interceptors.request.use((config) => {
  if (!config.headers.Authorization) {
    config.headers.Authorization = AUTH_HEADERS.Authorization;
  }

  return config;
});

export const generalRuntimeClient = {
  intent: {
    previewUtterance: (
      workspaceID: string,
      data: GeneralRuntimeIntentPreviewUtteranceRequest
    ): Promise<GeneralRuntimeIntentPreviewUtteranceResponse> =>
      axiosInstance
        .post<GeneralRuntimeIntentPreviewUtteranceRequest, { data: GeneralRuntimeIntentPreviewUtteranceResponse }>(
          `/test/${workspaceID}/classification`,
          data
        )
        .then((response) => response.data),
  },

  function: {
    test: (data: GeneralRuntimeFunctionTestRequest): Promise<GeneralRuntimeFunctionTestResponse> =>
      axiosInstance
        .post<GeneralRuntimeFunctionTestRequest, { data: GeneralRuntimeFunctionTestResponse }>(`/test/functions`, data)
        .then((response) => response.data),
  },
};
