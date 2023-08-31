import { datadogRum } from '@datadog/browser-rum';
import * as PlatformConfig from '@voiceflow/platform-config';

import client from '@/client';
import * as Errors from '@/config/errors';
import * as Project from '@/ducks/projectV2';
import { ownVendorIDSelector } from '@/ducks/projectV2/selectors/active/alexa';
import * as Session from '@/ducks/session';
import { openError } from '@/ModalsV2/utils';
import { Thunk } from '@/store/types';

import { updateAccount } from '../actions';
import { amazonVendorsSelector } from '../selectors';

// side effects

export const linkAccount =
  (code: string): Thunk<PlatformConfig.Alexa.Types.Account> =>
  async (dispatch) => {
    try {
      const amazon = await client.platform.alexa.session.linkAccount({ code });

      dispatch(updateAccount({ amazon }));

      return amazon;
    } catch (err) {
      datadogRum.addError(err);
      throw err;
    }
  };

export const loadAccount = (): Thunk => async (dispatch) => {
  const amazon = await client.platform.alexa.session.getAccount().catch(() => null);

  dispatch(updateAccount({ amazon }));
};

export const unlinkAccount = (): Thunk => async (dispatch) => {
  try {
    await client.platform.alexa.session.unlinkAccount();

    dispatch(updateAccount({ amazon: null }));
  } catch {
    openError();
  }
};

export const selectVendor =
  (vendorID: string): Thunk =>
  async (dispatch, getState) => {
    const projectID = Session.activeProjectIDSelector(getState());

    Errors.assertProjectID(projectID);

    const { skillID } = await client.platform.alexa.project.updateSelectedVendor(projectID, vendorID);

    dispatch(Project.alexa.updateActiveVendor(vendorID, skillID));
  };

export const resetSelectedVendor = (): Thunk => async (dispatch, getState) => {
  const projectID = Session.activeProjectIDSelector(getState());

  Errors.assertProjectID(projectID);

  const { skillID } = await client.platform.alexa.project.updateSelectedVendor(projectID, null);

  dispatch(Project.alexa.updateActiveVendor(null, skillID));
};

export const syncSelectedVendor = (): Thunk => async (dispatch, getState) => {
  await dispatch(loadAccount());

  const state = getState();
  const vendors = amazonVendorsSelector(state);
  const activeVendorID = ownVendorIDSelector(state);

  if (activeVendorID && vendors.length && !vendors.find((vendor) => vendor?.id === activeVendorID)) {
    await dispatch(selectVendor(vendors[0]?.id));
  }
};
