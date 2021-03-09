/* eslint-disable import/prefer-default-export */
import client from '@/client';
import * as AccountDuck from '@/ducks/account';
import { Thunk } from '@/store/types';

export const updateProfilePicture = (url: string): Thunk => async (dispatch) => {
  await client.user.updateProfilePicture(url);
  dispatch(AccountDuck.updateAccount({ image: url }));
};

export const saveSocialProfilePicture = (url: string): Thunk => async (dispatch) => {
  const blob = await fetch(url).then((r) => r.blob());

  const data = new FormData();
  data.append('image', blob);
  const s3Url = await client.file.uploadImage(null, data);

  await dispatch(updateProfilePicture(s3Url.data));
};
