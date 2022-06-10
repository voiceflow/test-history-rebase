import { Utils } from '@voiceflow/common';

import { undoTransaction } from '../actions';
import { addTransaction, createReducer } from './utils';

const undoTransactionReducer = createReducer(undoTransaction, (state, { transactionID, revertID }) => {
  const transaction = state.undo.find(({ id }) => id === transactionID);
  if (!transaction) return;

  state.undo = Utils.array.withoutValue(state.undo, transaction);
  addTransaction(state.redo, { id: revertID, apply: transaction.revert, revert: transaction.apply });
});

export default undoTransactionReducer;
