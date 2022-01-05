import { toast } from '@voiceflow/ui';

import client from '@/client';
import { Thunk } from '@/store/types';

import { updateAccount } from './actions';

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

export const confirmAccount =
  (token: string): Thunk =>
  async (dispatch) => {
    await client.user.confirmAccount(token);
    dispatch(updateAccount({ verified: true, first_login: true }));
  };
