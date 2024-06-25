import client from '@/client';
import { openError } from '@/ModalsV2/utils';
import type { Thunk } from '@/store/types';

import { updateAccount } from './actions';

export const updateUserProfileImage =
  (formData: FormData): Thunk<string> =>
  async (dispatch) => {
    try {
      const { image } = await client.identity.user.updateImage(formData);
      dispatch(updateAccount({ image }));
      return image;
    } catch (err) {
      openError({ error: 'Error updating workspace image' });
      throw err;
    }
  };

export const updateUserProfileName =
  (name: string): Thunk =>
  async (dispatch) => {
    await client.identity.user.update({ name });
    dispatch(updateAccount({ name }));
  };

export const verifySignupEmailToken =
  (token: string): Thunk =>
  async (dispatch) => {
    await client.identity.user.verifySignupEmailToken(token);

    dispatch(updateAccount({ verified: true, first_login: true }));
  };

export const resendSignupVerificationEmail =
  ({ query = {}, partnerKey }: { query?: Record<any, any>; partnerKey?: string } = {}): Thunk =>
  async () => {
    await client.identity.user.resendSignupVerificationEmail({ metadata: { inviteParams: query, partnerKey } });
  };

export const sendUpdateEmailEmail =
  (nextEmail: string, password: string): Thunk =>
  (_dispatch) =>
    client.identity.user.sendUpdateEmailEmail({ password, nextEmail });

export const verifyUpdateEmailToken =
  (token: string): Thunk =>
  async () => {
    await client.identity.user.verifyUpdateEmailToken(token);
  };
