import { Utils } from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import axios from 'axios';

import { ALEXA_SERVICE_ENDPOINT, GENERAL_SERVICE_ENDPOINT, GOOGLE_SERVICE_ENDPOINT } from '../config';
import api from './api';

export { default as Account } from './account';
export { default as Admin } from './admin';
export { default as Referral } from './referral';

const generateClient = (serviceEndpoint: string) => ({
  project: {
    copy: (projectID: string, data?: Partial<any>, params?: { channel?: string }) =>
      axios.post<any>(`${serviceEndpoint}/project/${projectID}/copy`, { ...data }, { params }).then((res) => res.data),
  },
});

export const getPlatformClient = Utils.platform.createPlatformSelectorV2<ReturnType<typeof generateClient>>(
  {
    [VoiceflowConstants.PlatformType.ALEXA]: generateClient(ALEXA_SERVICE_ENDPOINT),
    [VoiceflowConstants.PlatformType.GOOGLE]: generateClient(GOOGLE_SERVICE_ENDPOINT),
    [VoiceflowConstants.PlatformType.DIALOGFLOW_ES]: generateClient(GOOGLE_SERVICE_ENDPOINT),
  },
  generateClient(GENERAL_SERVICE_ENDPOINT)
);

const client = {
  api,
  platform: getPlatformClient,
};

export default client;
