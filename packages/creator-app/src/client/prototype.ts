import { BaseRequest, Config } from '@voiceflow/general-types';
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
    body: { state: Omit<PrototypeContext, 'trace'>; request: BaseRequest | null; config?: Config },
    sessionID?: string
  ): Promise<Response> =>
    axios.post<Response>(`${GENERAL_RUNTIME_ENDPOINT}/interact/${versionID}`, body, { headers: { sessionID } }).then(({ data }) => data),
};

export default prototypeClient;
