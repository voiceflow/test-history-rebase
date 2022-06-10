import { pushTransaction } from '../actions';
import { addTransaction, createReducer } from './utils';

const pushTransactionReducer = createReducer(pushTransaction, (state, { transaction }) => {
  if (state.buffer) {
    state.buffer.apply.push(...transaction.apply);
    state.buffer.revert.push(...transaction.revert);
  } else {
    addTransaction(state.undo, transaction);
    state.redo = [];
  }
});

export default pushTransactionReducer;
