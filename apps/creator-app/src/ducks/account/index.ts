import update from 'immutability-helper';

import type { RootReducer } from '@/store/types';

import type { AnyAccountAction } from './actions';
import { AccountAction } from './actions';
import type { AccountState } from './types';

export * from './actions';
export { STATE_KEY } from './constants';
export * from './provider';
export * from './selectors';
export * from './sideEffects';
export * from './types';

export const INITIAL_STATE: AccountState = {
  name: null,
  email: null,
  image: null,
  amazon: null,
  google: null,
  created: '',
  loading: false,
  verified: false,
  creator_id: null,
  first_login: false,
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
