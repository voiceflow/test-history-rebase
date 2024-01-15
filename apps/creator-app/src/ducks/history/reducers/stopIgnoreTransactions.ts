import { stopIgnoreTransactions } from '../actions';
import { createReducer } from './utils';

const stopIgnoreTransactionsReducer = createReducer(stopIgnoreTransactions, (state, { ignoreID }) => {
  state.ignore = state.ignore.filter((id) => id !== ignoreID);
});

export default stopIgnoreTransactionsReducer;
