import client from '@/client';
import { PlatformType } from '@/constants';
import * as Modal from '@/ducks/modal';
import * as Skill from '@/ducks/skill';
import { Account } from '@/models';
import { Thunk } from '@/store/types';
import { Nullable } from '@/types';

import { duckLogger } from '../utils';
import { updateAccount, updateAmazonAccount } from './actions';
import { STATE_KEY } from './constants';
import { amazonAccountSelector } from './selectors';

const log = duckLogger.child(STATE_KEY);

export const getVendors = (): Thunk => async (dispatch, getState) => {
  const state = getState();

  if (!amazonAccountSelector(state)) return;

  try {
    const vendors = await client.user.getVendors();
    if (Array.isArray(vendors)) {
      dispatch(updateAmazonAccount({ vendors }));
    }
  } catch (err) {
    log.error(err);
  }
};

export const createAmazonSession = (code: string): Thunk<Nullable<Account.Amazon>> => async (dispatch) => {
  try {
    const amazon = (await client.session.amazon.linkAccount(code)) || null;
    dispatch(updateAccount({ amazon }));

    return amazon;
  } catch (err) {
    log.error(err);
    throw err;
  }
};

export const checkAmazonAccount = (): Thunk => async (dispatch) => {
  let amazon = null;
  try {
    amazon = (await client.session.amazon.getAccount()) || null;
  } catch (err) {
    log.error(err);
  }
  dispatch(updateAccount({ amazon }));
};

export const deleteAmazonAccount = (): Thunk => async (dispatch) => {
  try {
    await client.session.amazon.deleteAccount();
    dispatch(updateAccount({ amazon: null }));
  } catch (err) {
    dispatch(Modal.setError('Something went wrong - please refresh your page'));
  }
};

export const updateAmznId = (projectID: string, vendorID: string, newAmznID: string): Thunk => async (dispatch) => {
  try {
    const returnAmznID = await client.project.updateAmznId(projectID, vendorID, newAmznID);

    dispatch(Skill.updatePublishPlatforms[PlatformType.ALEXA]({ amznID: returnAmznID }));
  } catch (err) {
    dispatch(Modal.setError('Something went wrong - please refresh your page'));
  }
};

export const createGoogleSession = (code: string): Thunk => async (dispatch) => {
  try {
    const google = (await client.session.google.linkAccount(code)) || null;
    dispatch(updateAccount({ google }));
  } catch (err) {
    log.error(err);
    throw err;
  }
};

export const checkGoogleAccount = (): Thunk => async (dispatch) => {
  let google = null;
  try {
    google = (await client.session.google.getAccount()) || null;
  } catch (err) {
    log.error(err);
  }
  dispatch(updateAccount({ google }));
};

export const deleteGoogleAccount = (): Thunk => async (dispatch) => {
  try {
    await client.session.google.deleteAccount();
    dispatch(updateAccount({ google: null }));
  } catch (err) {
    dispatch(Modal.setError('Something went wrong - please refresh your page'));
  }
};
