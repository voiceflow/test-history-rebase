import axios from 'axios';

import { GENERAL_RUNTIME_ENDPOINT } from '@/config';
import { formatBuiltInIntentName } from '@/utils/intent.util';

import { AUTH_HEADERS } from '../constant';
import {
  GeneralRuntimeFunctionTestRequest,
  GeneralRuntimeFunctionTestResponse,
  GeneralRuntimeIntentPreviewUtteranceRequest,
  GeneralRuntimeIntentPreviewUtteranceResponse,
  GeneralRuntimeIntentResponse,
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
        .then((response) => {
          const formatIntents = (intents: GeneralRuntimeIntentResponse[]) => {
            intents.forEach((intent) => {
              intent.name = formatBuiltInIntentName()(intent.name);
            });
          };

          formatIntents(response.data.nlu.intents);
          formatIntents(response.data.llm.intents);

          return response.data;
        }),
  },

  function: {
    test: (data: GeneralRuntimeFunctionTestRequest): Promise<GeneralRuntimeFunctionTestResponse> =>
      axiosInstance
        .post<GeneralRuntimeFunctionTestRequest, { data: GeneralRuntimeFunctionTestResponse }>(`/test/functions`, data)
        .then((response) => response.data),
  },
};
