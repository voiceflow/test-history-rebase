import { Account } from '@/models';

import { api } from './fetch';

export const USER_PATH = 'user';

const userClient = {
  get: () => api.get<Account>(USER_PATH),

  updateProfilePicture: (url: string) => api.post(`${USER_PATH}/profilePictureURL`, { url }),

  getReferralCouponCode: (referrerID: number) => api.get<string | null>(`${USER_PATH}/referral/${referrerID}`),
};

export default userClient;
