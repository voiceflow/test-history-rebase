import { RootReducer } from '@voiceflow/ui';

import { AccountAction, AnyAccountAction } from './actions';
import { INITIAL_STATE } from './constants';
import { AccountState } from './types';

export * from './actions';
export * from './constants';
export * from './selectors';
export * from './sideEffects';
export * from './types';

// reducers
const accountReducer: RootReducer<AccountState, AnyAccountAction> = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case AccountAction.UPDATE_ACCOUNT:
    case AccountAction.UPDATE_VENDORS:
      return {
        ...state,
        ...action.payload,
      };

    case AccountAction.RESET_ACCOUNT:
      return INITIAL_STATE;
    default:
      return state;
  }
};

export default accountReducer;
