import type { Struct } from '@voiceflow/common';

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

export const verifySignupEmailToken =
  (token: string): Thunk =>
  async (dispatch) => {
    await client.identity.user.verifySignupEmailToken(token);

    dispatch(updateAccount({ verified: true, first_login: true }));
  };

export const resendSignupVerificationEmail =
  ({ query = {} }: { query?: Struct } = {}): Thunk =>
  async () => {
    await client.identity.user.resendSignupVerificationEmail({ metadata: { inviteParams: query } });
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
