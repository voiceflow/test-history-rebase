import { Account } from '@/models';

import { api } from './fetch';

export const USER_PATH = 'user';

const userClient = {
  get: () => api.get<Account>(USER_PATH),

  getReferralCouponCode: (referrerID: number, referralCode: string) => api.get<string | null>(`${USER_PATH}/referral/${referrerID}/${referralCode}`),
};

export default userClient;
