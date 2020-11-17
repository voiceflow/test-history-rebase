import axios from 'axios';

import { API_ENDPOINT } from '@/config';
import { Account } from '@/models';

const ssoClient = {
  login: (data: { code: string; coupon?: string }) =>
    axios.post<{ token: string; user: Account }>(`${API_ENDPOINT}/v2/sso/login`, data).then((res) => res.data),
};

export default ssoClient;
