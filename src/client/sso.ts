import { SessionType } from '@/constants';
import { Account } from '@/models';

import { apiV2 } from './fetch';

export const SSO_PATH = 'sso';

const CONVERT_ENDPOINTS = {
  [SessionType.BASIC_AUTH]: 'basic',
  [SessionType.GOOGLE]: 'google',
  [SessionType.FACEBOOK]: 'facebook',
};

export type SSOLoginPayload = {
  domain: string;
  code: string;
  coupon?: string;
};

export type SSOConvertPayload = {
  domain: string;
  oktaCode: string;
  authCode: string;
};

const ssoClient = {
  login: (data: SSOLoginPayload) => apiV2.post<{ token: string; user: Account }>(`${SSO_PATH}/login`, data),

  convert: (session: SessionType, data: SSOConvertPayload) => {
    if (session === SessionType.SIGN_UP) {
      throw new Error('unable to convert account for this session type');
    }

    return apiV2.post<{ token: string; user: Account }>(`${SSO_PATH}/convert/${CONVERT_ENDPOINTS[session]}`, data);
  },
};

export default ssoClient;
