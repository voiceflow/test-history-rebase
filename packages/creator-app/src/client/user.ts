import { Account } from '@/models';

import { api } from './fetch';

export const USER_PATH = 'user';

const userClient = {
  get: () => api.get<Account>(USER_PATH),

  updateProfilePicture: (url: string) => api.post(`${USER_PATH}/profilePictureURL`, { url }),

  updatePassword: (currentPassword: string, nextPassword: string) => api.post(`${USER_PATH}/updatePassword`, { currentPassword, nextPassword }),

  updateProfileName: (nextProfileName: string) => api.post(`${USER_PATH}/updateProfileName`, { nextProfileName }),

  updateEmail: (currentPassword: string, nextEmail: string) => api.post(`${USER_PATH}/updateEmailVerfication`, { currentPassword, nextEmail }),

  getReferralCouponCode: (referrerID: number, referralCode: string) => api.get<string | null>(`${USER_PATH}/referral/${referrerID}/${referralCode}`),

  resetEmail: (email: string) => api.post(`${USER_PATH}/reset`, { email }),

  testResetPassword: (resetCode: string) => api.get(`${USER_PATH}/reset/${resetCode}`),

  resetPassword: (creatorID: string, password: string) => api.post(`${USER_PATH}/reset/${creatorID}`, { password }),

  resendConfirmationEmail: (): Promise<void> => api.post(`${USER_PATH}/verify`),

  confirmAccount: (token: string): Promise<void> => api.post(`${USER_PATH}/verify/${token}`),

  confirmEmailUpdate: (token: string): Promise<void> => api.post(`${USER_PATH}/verifyEmailUpdate/${token}`),
};

export default userClient;
