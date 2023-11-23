import { datadogRum } from '@datadog/browser-rum';
import * as PlatformConfig from '@voiceflow/platform-config';
import { LOGROCKET_ENABLED } from '@voiceflow/ui';

import client from '@/client';
import { openError } from '@/ModalsV2/utils';
import { Thunk } from '@/store/types';
import * as LogRocket from '@/vendors/logrocket';

import { updateAccount } from '../actions';

// side effects

export const linkAccount =
  (code: string): Thunk<PlatformConfig.Google.Types.Account> =>
  async (dispatch) => {
    try {
      const google = await client.platform.google.session.linkAccount({ code });

      dispatch(updateAccount({ google }));

      return google;
    } catch (error) {
      if (LOGROCKET_ENABLED) {
        LogRocket.error(error);
      } else {
        datadogRum.addError(error);
      }
      throw error;
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
