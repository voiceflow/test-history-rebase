import { Utils } from '@voiceflow/common';

import { redoTransaction } from '../actions';
import { addTransaction, createReducer } from './utils';

const redoTransactionReducer = createReducer(redoTransaction, (state, { transactionID, revertID }) => {
  const transaction = state.redo.find(({ id }) => id === transactionID);
  if (!transaction) return;

  state.redo = Utils.array.withoutValue(state.redo, transaction);
  addTransaction(state.undo, { id: revertID, apply: transaction.revert, revert: transaction.apply });
});

export default redoTransactionReducer;
