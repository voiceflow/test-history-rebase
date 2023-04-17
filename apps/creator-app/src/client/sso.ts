import { SessionType } from '@/constants';
import type { Account } from '@/models';

import { apiV2 } from './fetch';

export const SSO_PATH = 'sso';

export const SSO_CONVERT_ENDPOINTS = {
  [SessionType.BASIC_AUTH]: 'basic',
  [SessionType.GOOGLE]: 'google',
  [SessionType.FACEBOOK]: 'facebook',
};

export interface SSOLoginPayload {
  domain: string;
  code: string;
  coupon?: string;
}

export interface SSOConvertPayload {
  domain: string;
  oktaCode: string;
  authCode: string;
}

const ssoClient = {
  login: (data: SSOLoginPayload, queryParams?: {}) => apiV2.post<{ token: string; user: Account }>(`${SSO_PATH}/login`, { ...data, queryParams }),

  convert: (session: SessionType, data: SSOConvertPayload) => {
    if (session === SessionType.SIGN_UP) {
      throw new Error('unable to convert account for this session type');
    }

    return apiV2.post<{ token: string; user: Account }>(`${SSO_PATH}/convert/${SSO_CONVERT_ENDPOINTS[session]}`, data);
  },
};

export default ssoClient;
