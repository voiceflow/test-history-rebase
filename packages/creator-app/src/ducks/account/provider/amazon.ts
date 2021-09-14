import client from '@/client';
import * as Errors from '@/config/errors';
import * as Modal from '@/ducks/modal';
import * as Project from '@/ducks/project';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Session from '@/ducks/session';
import { Account } from '@/models';
import { Thunk } from '@/store/types';
import { Nullable } from '@/types';
import * as Sentry from '@/vendors/sentry';

import { updateAccount } from '../actions';
import { amazonVendorsSelector } from '../selectors';

// side effects

export const linkAccount =
  (code: string): Thunk<Nullable<Account.Amazon>> =>
  async (dispatch) => {
    try {
      const amazon = await client.platform.alexa.session.linkAccount({ code });
      dispatch(updateAccount({ amazon }));
      return amazon;
    } catch (err) {
      Sentry.error(err);
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
    dispatch(Modal.setGenericError());
  }
};

export const activateVendor =
  (vendorID: string): Thunk =>
  async (dispatch, getState) => {
    const projectID = Session.activeProjectIDSelector(getState());

    Errors.assertProjectID(projectID);

    const { skillID } = await client.platform.alexa.project.updateSelectedVendor(projectID, vendorID);

    dispatch(Project.alexa.updateActiveVendor(vendorID, skillID));
  };

export const syncSelectedVendor = (): Thunk => async (dispatch, getState) => {
  await dispatch(loadAccount());

  const state = getState();
  const vendors = amazonVendorsSelector(state);
  const activeVendorID = ProjectV2.active.alexa.ownVendorIDSelector(state);

  if (activeVendorID && vendors.length && !vendors.find((vendor) => vendor?.id === activeVendorID)) {
    await dispatch(activateVendor(vendors[0]?.id));
  }
};
