import { Struct } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { toast } from '@voiceflow/ui';

import client from '@/client';
import * as Feature from '@/ducks/feature';
import { openError } from '@/ModalsV2/utils';
import { Thunk } from '@/store/types';

import { updateAccount } from './actions';

export const updateUserProfileImage =
  (formData: FormData): Thunk<string> =>
  async () => {
    try {
      const { image } = await client.identity.user.updateImage(formData);
      return image;
    } catch (err) {
      openError({ error: 'Error updating workspace image' });
      throw err;
    }
  };

export const saveProfilePicture =
  (url: string | null): Thunk =>
  async (dispatch) => {
    await client.user.updateProfilePicture(url ?? '');
    dispatch(updateAccount({ image: url ?? '' }));
    toast.success('Profile picture successfully updated');
  };

export const saveSocialProfilePicture =
  (url: string): Thunk =>
  async (dispatch) => {
    const blob = await fetch(url).then((r) => r.blob());
    const data = new FormData();
    data.append('image', blob);
    const s3Url = await client.file.uploadImage(null, data);
    await dispatch(saveProfilePicture(s3Url.data));
  };

export const verifySignupEmailToken =
  (token: string): Thunk =>
  async (dispatch, getState) => {
    const isIdentityUserEnabled = Feature.isFeatureEnabledSelector(getState())(Realtime.FeatureFlag.IDENTITY_USER);
    if (isIdentityUserEnabled) {
      await client.identity.user.verifySignupEmailToken(token);
    } else {
      await client.user.confirmAccount(token);
    }
    dispatch(updateAccount({ verified: true, first_login: true }));
  };

export const resendSignupVerificationEmail =
  ({ query = {} }: { query?: Struct } = {}): Thunk =>
  async (_dispatch, getState) => {
    const isIdentityUserEnabled = Feature.isFeatureEnabledSelector(getState())(Realtime.FeatureFlag.IDENTITY_USER);

    if (isIdentityUserEnabled) {
      await client.identity.user.resendSignupVerificationEmail({ metadata: { inviteParams: query } });
    } else {
      await client.user.resendConfirmationEmail();
    }
  };

export const sendUpdateEmailEmail =
  (nextEmail: string, password: string): Thunk =>
  (_dispatch) =>
    client.identity.user.sendUpdateEmailEmail({ password, nextEmail });

export const confirmEmailUpdate =
  (token: string): Thunk =>
  async (_dispatch, getState) => {
    const isIdentityUserEnabled = Feature.isFeatureEnabledSelector(getState())(Realtime.FeatureFlag.IDENTITY_USER);

    if (isIdentityUserEnabled) {
      return client.identity.user.verifyUpdateEmailToken(token);
    }

    try {
      await client.user.confirmEmailUpdate(token);

      toast.success('Email successfully updated, log in to continue');
    } catch {
      toast.error('Invalid verification link - expired or broken');
    }
  };
