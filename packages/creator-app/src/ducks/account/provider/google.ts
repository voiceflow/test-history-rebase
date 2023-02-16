import { datadogRum } from '@datadog/browser-rum';
import { Nullable } from '@voiceflow/common';

import client from '@/client';
import { openError } from '@/ModalsV2/utils';
import { Account } from '@/models';
import { Thunk } from '@/store/types';

import { updateAccount } from '../actions';

// side effects

export const linkAccount =
  (code: string): Thunk<Nullable<Account.Google>> =>
  async (dispatch) => {
    try {
      const google = await client.platform.google.session.linkAccount({ code });

      dispatch(updateAccount({ google }));

      return google;
    } catch (err) {
      datadogRum.addError(err);
      throw err;
    }
  };

export const loadAccount = (): Thunk => async (dispatch) => {
  const google = await client.platform.google.session.getAccount().catch(() => null);

  dispatch(updateAccount({ google }));
};

export const unlinkAccount = (): Thunk => async (dispatch) => {
  try {
    await client.platform.google.session.unlinkAccount();

    dispatch(updateAccount({ google: null }));
  } catch {
    openError();
  }
};
