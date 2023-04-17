import * as History from '@/ducks/history';
import { InvalidatorLookup } from '@/store/types';

import { collectInvalidTransactions, createHistoryTransducer } from './utils';

const invalidatorTransducer = createHistoryTransducer<[InvalidatorLookup]>((invalidators) => (state, action, { isOwnAction }) => {
  if (isOwnAction) return null;

  const invalid = collectInvalidTransactions(invalidators, state, action);

  if (invalid.length) {
    return History.dropTransactions({ transactionIDs: invalid.map(({ id }) => id) });
  }

  return null;
});

export default invalidatorTransducer;
