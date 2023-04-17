import { dropTransactions } from '../actions';
import { createReducer } from './utils';

const dropTransactionsReducer = createReducer(dropTransactions, (state, { transactionIDs }) => {
  state.undo = state.undo.filter((transaction) => !transactionIDs.includes(transaction.id));
  state.redo = state.redo.filter((transaction) => !transactionIDs.includes(transaction.id));
});

export default dropTransactionsReducer;
