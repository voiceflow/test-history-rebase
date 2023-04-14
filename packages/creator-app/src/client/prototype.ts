import { BaseRequest } from '@voiceflow/base-types';
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

export const testAPIClient = axios.create({
  baseURL: GENERAL_RUNTIME_ENDPOINT,
  withCredentials: true,
});

export default prototypeClient;
