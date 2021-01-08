import { Account } from '@/models';

import { apiV2 } from './fetch';

const ssoClient = {
  login: (data: { code: string; coupon?: string }) => apiV2.post<{ token: string; user: Account }>('sso/login', data),
};

export default ssoClient;
