import { startIgnoreTransactions } from '../actions';
import { createReducer } from './utils';

const startIgnoreTransactionsReducer = createReducer(startIgnoreTransactions, (state, { ignoreID }) => {
  state.ignore.push(ignoreID);
});

export default startIgnoreTransactionsReducer;
