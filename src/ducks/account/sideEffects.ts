import client from '@/client';
import { PlatformType } from '@/constants';
import * as Modal from '@/ducks/modal';
import * as PublishInfo from '@/ducks/skill/publishInfo';
import { activeProjectIDSelector } from '@/ducks/skill/skill/selectors';
import { Account } from '@/models';
import { Thunk } from '@/store/types';
import { Nullable } from '@/types';

import { duckLogger } from '../utils';
import { updateAccount } from './actions';
import { STATE_KEY } from './constants';
import { amazonVendorsSelector } from './selectors';

const log = duckLogger.child(STATE_KEY);

export const linkGoogleAccount = (code: string): Thunk<Nullable<Account.Google>> => async (dispatch) => {
  try {
    const google = await client.platform.google.session.linkAccount({ code });

    dispatch(updateAccount({ google }));

    return google;
  } catch (err) {
    log.error(err);
    throw err;
  }
};

export const getGoogleAccount = (): Thunk => async (dispatch) => {
  let google: Nullable<Account.Google> = null;

  try {
    google = await client.platform.google.session.getAccount();
  } catch (err) {
    log.error(err);
  }

  dispatch(updateAccount({ google }));
};

export const unlinkGoogleAccount = (): Thunk => async (dispatch) => {
  try {
    await client.platform.google.session.unlinkAccount();

    dispatch(updateAccount({ google: null }));
  } catch {
    dispatch(Modal.setError('Something went wrong - please refresh your page'));
  }
};

export const linkAmazonAccount = (code: string): Thunk<Nullable<Account.Amazon>> => async (dispatch) => {
  try {
    const amazon = await client.platform.alexa.session.linkAccount({ code });
    dispatch(updateAccount({ amazon }));
    return amazon;
  } catch (err) {
    log.error(err);
    throw err;
  }
};

export const getAmazonAccount = (): Thunk => async (dispatch) => {
  let amazon: Nullable<Account.Amazon> = null;

  try {
    amazon = await client.platform.alexa.session.getAccount();
  } catch (err) {
    log.error(err);
  }

  dispatch(updateAccount({ amazon }));
};

export const unlinkAmazonAccount = (): Thunk => async (dispatch) => {
  try {
    await client.platform.alexa.session.unlinkAccount();

    dispatch(updateAccount({ amazon: null }));
  } catch {
    dispatch(Modal.setError('Something went wrong - please refresh your page'));
  }
};

export const updateVendorSkillID = (projectID: string, vendorID: string, skillID: string): Thunk => async (dispatch) => {
  await client.platform.alexa.project.updateVendorSkillID(projectID, vendorID, skillID);

  dispatch(PublishInfo.updatePublishPlatforms[PlatformType.ALEXA]({ amznID: skillID }));
};

export const updateSelectedVendor = (vendorID: string): Thunk => async (dispatch, getState) => {
  const projectID = activeProjectIDSelector(getState());

  const { skillID } = await client.platform.alexa.project.updateSelectedVendor(projectID, vendorID);

  dispatch(PublishInfo.updatePublishPlatforms[PlatformType.ALEXA]({ amznID: skillID, vendorId: vendorID }));
};

export const syncSelectedVendor = (): Thunk => async (dispatch, getState) => {
  await dispatch(getAmazonAccount());

  const state = getState();
  const vendors = amazonVendorsSelector(state);
  const skillVendor = PublishInfo.selectedVendorSelector(state);

  if (skillVendor && vendors.length && !vendors.find((vendor) => vendor?.id === skillVendor)) {
    await dispatch(updateSelectedVendor(vendors[0]?.id));
  }
};
