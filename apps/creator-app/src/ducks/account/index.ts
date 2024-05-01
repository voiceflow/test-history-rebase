import update from 'immutability-helper';

import { createRootReducer } from '../utils';
import { resetAccount, updateAccount, updateAmazonAccount, updateGoogleAccount } from './actions';
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

const accountReducer = createRootReducer(INITIAL_STATE)
  .mimerCase(updateGoogleAccount, (state, payload) => {
    if (!state.google) return;
    state.google = update(state.google, { $merge: payload });
  })

  .mimerCase(updateAmazonAccount, (state, payload) => {
    if (!state.amazon) return;
    state.amazon = update(state.amazon, { $merge: payload });
  })

  .mimerCase(updateAccount, (state, payload) => {
    Object.assign(state, payload);
  })

  .mimerCase(resetAccount, () => INITIAL_STATE)

  .build();

export default accountReducer;
