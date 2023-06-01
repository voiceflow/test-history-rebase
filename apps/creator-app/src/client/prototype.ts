import { BaseModels, BaseRequest, BaseUtils } from '@voiceflow/base-types';
import axios from 'axios';

import { GENERAL_RUNTIME_ENDPOINT } from '@/config';
import { PrototypeContext } from '@/models';

export const LEGACY_TESTING_PATH = 'test';
export const PROTOTYPE_PATH = 'prototype';

interface Response {
  state: PrototypeContext;
  trace: PrototypeContext['trace'];
}

const prototypeClient = {
  interact: (
    versionID: string,
    body: { state: Omit<PrototypeContext, 'trace'>; request: BaseRequest.BaseRequest | null; config?: BaseRequest.RequestConfig },
    headers: { sessionID?: string; platform?: string } = {}
  ): Promise<Response> => axios.post<Response>(`${GENERAL_RUNTIME_ENDPOINT}/interact/${versionID}`, body, { headers }).then(({ data }) => data),
};

const runtimeClient = axios.create({
  baseURL: GENERAL_RUNTIME_ENDPOINT,
  withCredentials: true,
});

export const testAPIClient = Object.assign(runtimeClient, {
  completion: (params: BaseUtils.ai.AIModelParams & BaseUtils.ai.AIContextParams) =>
    runtimeClient.post<{ output: string | null }>('/test/completion', params).then(({ data }) => data),
  knowledgeBase: (params: { projectID: string; question: string; settings?: BaseModels.Project.KnowledgeBaseSettings }) =>
    runtimeClient.post('/test/knowledge-base', params).then(({ data }) => data),
});

export default prototypeClient;
