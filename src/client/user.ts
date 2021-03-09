import { Account } from '@/models';

import { api } from './fetch';

export const USER_PATH = 'user';

const userClient = {
  get: () => api.get<Account>(USER_PATH),

  updateProfilePicture: (url: string) => api.post(`${USER_PATH}/profilePictureURL`, { url }),

  getReferralCouponCode: (referrerID: number, referralCode: string) => api.get<string | null>(`${USER_PATH}/referral/${referrerID}/${referralCode}`),

  resetEmail: (email: string) => api.post(`${USER_PATH}/reset`, { email }),

  testResetPassword: (resetCode: string) => api.get(`${USER_PATH}/reset/${resetCode}`),

  resetPassword: (creatorID: string, password: string) => api.post(`${USER_PATH}/reset/${creatorID}`, { password }),
};

export default userClient;
