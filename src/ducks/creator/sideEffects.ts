import client from '@/client';
import * as AccountDuck from '@/ducks/account';
import { Thunk } from '@/store/types';

export const updateProfilePicture = (url: string): Thunk => async (dispatch) => {
  await client.user.updateProfilePicture(url);
  dispatch(AccountDuck.updateAccount({ image: url }));
};
