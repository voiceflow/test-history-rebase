import * as Account from '@/ducks/account';
import type { State } from '@/store/types';

import type { Transducer } from './types';

const resetTransducer: Transducer<State> = (rootReducer) => (state, action) => {
  let nextState: Partial<State | undefined> = state;

  if (action.type === Account.AccountAction.RESET_ACCOUNT) {
    nextState = {
      viewport: nextState?.viewport,
      ui: nextState?.ui,
      recent: nextState?.recent,
    };
  }

  return rootReducer(nextState as State | undefined, action);
};

export default resetTransducer;
