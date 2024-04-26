import axios from 'axios';

import { GENERAL_RUNTIME_ENDPOINT } from '@/config';
import { formatBuiltInIntentName } from '@/utils/intent.util';

import { AUTH_HEADERS } from '../constant';
import type {
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
        .post<
          GeneralRuntimeIntentPreviewUtteranceRequest,
          { data: GeneralRuntimeIntentPreviewUtteranceResponse }
        >(`/test/${workspaceID}/classification`, data)
        .then((response) => {
          const nameFormatter = formatBuiltInIntentName();

          const formatIntents = <T extends GeneralRuntimeIntentResponse>(intents: T[]) =>
            intents.map((intent) => ({ ...intent, name: nameFormatter(intent.name) }));

          return {
            ...response.data,
            nlu: { ...response.data.nlu, intents: formatIntents(response.data.nlu.intents) },
            llm: { ...response.data.llm, intents: formatIntents(response.data.llm.intents) },
          };
        }),
  },

  function: {
    test: (data: GeneralRuntimeFunctionTestRequest): Promise<GeneralRuntimeFunctionTestResponse> =>
      axiosInstance
        .post<GeneralRuntimeFunctionTestRequest, { data: GeneralRuntimeFunctionTestResponse }>('/test/functions', data)
        .then((response) => response.data),
  },
};
