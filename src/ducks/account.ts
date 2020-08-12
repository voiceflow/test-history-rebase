import update from 'immutability-helper';
import { createSelector } from 'reselect';

import client from '@/client';
import { setError } from '@/ducks/modal';
import { Account } from '@/models';
import { Action, RootReducer, Thunk } from '@/store/types';
import { Nullable, NullableRecord } from '@/types';

import { createAction, createRootSelector, duckLogger } from './utils';

export type AccountState = NullableRecord<Account> & {
  loading: boolean;
  admin: number;
  amazon: Account.Amazon | null;
  google: Account.Google | null;
  first_login: boolean;
};

export const STATE_KEY = 'account';
export const INITIAL_STATE: AccountState = {
  loading: false,
  first_login: false,
  email: null,
  name: null,
  creator_id: null,
  admin: 0,
  image: null,
  amazon: null,
  google: null,
  created: null,
};

const log = duckLogger.child(STATE_KEY);

export enum AccountAction {
  UPDATE_ACCOUNT = 'UPDATE_ACCOUNT',
  UPDATE_AMAZON_ACCOUNT = 'UPDATE_AMAZON_ACCOUNT',
  UPDATE_GOOGLE_ACCOUNT = 'UPDATE_GOOGLE_ACCOUNT',
  RESET_ACCOUNT = 'RESET_ACCOUNT',
}

// action types

export type UpdateGoogleAccount = Action<AccountAction.UPDATE_GOOGLE_ACCOUNT, Account.Google>;

export type UpdateAmazonAccount = Action<AccountAction.UPDATE_AMAZON_ACCOUNT, Partial<Account.Amazon>>;

export type UpdateAccount = Action<AccountAction.UPDATE_ACCOUNT, Partial<AccountState>>;

export type ResetAccount = Action<AccountAction.RESET_ACCOUNT>;

type AnyAccountAction = UpdateGoogleAccount | UpdateAmazonAccount | UpdateAccount | ResetAccount;

// reducers

const accountReducer: RootReducer<AccountState, AnyAccountAction> = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case AccountAction.UPDATE_GOOGLE_ACCOUNT:
      if (!state.google) return state;
      return update(state, { google: { $merge: action.payload } });
    case AccountAction.UPDATE_AMAZON_ACCOUNT:
      if (!state.amazon) return state;
      return update(state, { amazon: { $merge: action.payload } });
    case AccountAction.UPDATE_ACCOUNT:
      return { ...state, ...action.payload };
    case AccountAction.RESET_ACCOUNT:
      return INITIAL_STATE;
    default:
      return state;
  }
};

export default accountReducer;

// selectors

export const userSelector = createRootSelector(STATE_KEY);

export const userIDSelector = createSelector([userSelector], ({ creator_id }) => creator_id);

export const isFirstLoginSelector = createSelector([userSelector], ({ first_login }) => first_login);

export const userEmailSelector = createSelector([userSelector], ({ email }) => email);

export const amazonAccountSelector = createSelector([userSelector], ({ amazon }) => amazon);

export const amazonVendorsSelector = createSelector([amazonAccountSelector], (amazon) => amazon?.vendors ?? []);

export const googleAccountSelector = createSelector([userSelector], ({ google }) => google);

export const googleEmailSelector = createSelector([googleAccountSelector], (google) => google?.profile?.email || '0');

// action creators

export const resetAccount = (): ResetAccount => createAction(AccountAction.RESET_ACCOUNT);

export const updateAccount = (account: Partial<AccountState>): UpdateAccount => createAction(AccountAction.UPDATE_ACCOUNT, account);

export const updateAmazonAccount = (account: Partial<Account.Amazon>): UpdateAmazonAccount =>
  createAction(AccountAction.UPDATE_AMAZON_ACCOUNT, account);

export const updateGoogleAccount = (account: Account.Google): UpdateGoogleAccount => createAction(AccountAction.UPDATE_GOOGLE_ACCOUNT, account);

// side effects

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
    dispatch(setError('Something went wrong - please refresh your page'));
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
    dispatch(setError('Something went wrong - please refresh your page'));
  }
};
