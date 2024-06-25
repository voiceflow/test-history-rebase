import { createReducerFactory } from '@/ducks/utils';

import { MAX_HISTORY_LENGTH } from '../constants';
import type { HistoryState, Transaction } from '../types';

export const createReducer = createReducerFactory<HistoryState>();

export const addTransaction = (transactions: Transaction[], transaction: Transaction) => {
  transactions.push(transaction);

  if (transactions.length > MAX_HISTORY_LENGTH) {
    transactions.shift();
  }
};
