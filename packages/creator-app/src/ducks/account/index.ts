import update from 'immutability-helper';

import { RootReducer } from '@/store/types';

import { AccountAction, AnyAccountAction } from './actions';
import { AccountState } from './types';

export * from './actions';
export { STATE_KEY } from './constants';
export * from './provider';
export * from './selectors';
export * from './sideEffects';
export * from './types';

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
  verified: false,
  referrer_id: null,
  referral_code: null,
  gid: null,
  fid: null,
  okta_id: null,
  saml_provider_id: null,
};

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
