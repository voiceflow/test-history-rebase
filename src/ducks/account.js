import update from 'immutability-helper';
import { createSelector } from 'reselect';

import client from '@/client';
import { setError } from '@/ducks/modal';

import { createAction, createRootSelector } from './utils';

export const STATE_KEY = 'account';
export const INITIAL_STATE = {
  loading: false,
  email: null,
  name: null,
  creator_id: null,
  admin: 0,
  image: null,
  amazon: null,
  google: null,
};

// actions

export const UPDATE_ACCOUNT = 'UPDATE_ACCOUNT';
export const UPDATE_AMAZON_ACCOUNT = 'UPDATE_AMAZON_ACCOUNT';
export const UPDATE_GOOGLE_ACCOUNT = 'UPDATE_GOOGLE_ACCOUNT';
export const RESET_ACCOUNT = 'RESET_ACCOUNT';

// reducers

export default function accountReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case UPDATE_GOOGLE_ACCOUNT:
      if (!state.google) return state;
      return update(state, { google: { $merge: action.payload } });
    case UPDATE_AMAZON_ACCOUNT:
      if (!state.amazon) return state;
      return update(state, { amazon: { $merge: action.payload } });
    case UPDATE_ACCOUNT:
      return { ...state, ...action.payload };
    case RESET_ACCOUNT:
      return INITIAL_STATE;
    default:
      return state;
  }
}

// selectors

export const userSelector = createRootSelector(STATE_KEY);

export const userIDSelector = createSelector(userSelector, ({ creator_id }) => creator_id);

export const amazonAccountSelector = createSelector(userSelector, ({ amazon }) => amazon);

// action creators

export const resetAccount = () => createAction(RESET_ACCOUNT);

export const updateAccount = (account) => createAction(UPDATE_ACCOUNT, account);

export const updateAmazonAccount = (account) => createAction(UPDATE_AMAZON_ACCOUNT, account);

export const updateGoogleAccount = (account) => createAction(UPDATE_GOOGLE_ACCOUNT, account);

// side effects

export const getVendors = () => async (dispatch, getState) => {
  const state = getState();

  if (!amazonAccountSelector(state)) return;

  try {
    const vendors = await client.user.getVendors();
    if (Array.isArray(vendors)) {
      dispatch(updateAmazonAccount({ vendors }));
    }
  } catch (err) {
    console.error(err);
  }
};

export const createAmazonSession = (code) => async (dispatch) => {
  try {
    const amazon = client.session.amazon.linkAccount(code) || null;
    dispatch(updateAccount({ amazon }));
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const checkAmazonAccount = () => async (dispatch) => {
  let amazon = null;
  try {
    amazon = (await client.session.amazon.getAccount()) || null;
  } catch (err) {
    console.error(err);
  }
  dispatch(updateAccount({ amazon }));
};

export const deleteAmazonAccount = () => async (dispatch) => {
  try {
    await client.session.amazon.deleteAccount();
    dispatch(updateAccount({ amazon: null }));
  } catch (err) {
    dispatch(setError('Something went wrong - please refresh your page'));
  }
};

export const createGoogleSession = (code) => async (dispatch) => {
  try {
    const google = (await client.session.google.linkAccount(code)) || null;
    dispatch(updateAccount({ google }));
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const checkGoogleAccount = () => async (dispatch) => {
  let google = null;
  try {
    google = (await client.session.google.getAccount()) || null;
  } catch (err) {
    console.error(err);
  }
  dispatch(updateAccount({ google }));
};

export const deleteGoogleAccount = () => async (dispatch) => {
  try {
    await client.session.google.deleteAccount();
    dispatch(updateAccount({ google: null }));
  } catch (err) {
    dispatch(setError('Something went wrong - please refresh your page'));
  }
};
