import { flushTransaction } from '../actions';
import { addTransaction, createReducer } from './utils';

const flushTransactionReducer = createReducer(flushTransaction, (state, { transactionID }) => {
  if (!state.buffer) return;
  if (state.buffer.id !== transactionID) return;

  if (state.buffer.apply.length && state.buffer.revert.length) {
    addTransaction(state.undo, state.buffer);
    state.redo = [];
  }

  state.buffer = null;
});

export default flushTransactionReducer;
