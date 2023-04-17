import { startTransaction } from '../actions';
import { createReducer } from './utils';

const startTransactionReducer = createReducer(startTransaction, (state, { transactionID }) => {
  if (state.buffer) return;

  state.buffer = {
    id: transactionID,
    apply: [],
    revert: [],
  };
});

export default startTransactionReducer;
