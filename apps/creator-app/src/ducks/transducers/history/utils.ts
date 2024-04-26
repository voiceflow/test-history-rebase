import type { AnyAction } from 'redux';
import type { Action } from 'typescript-fsa';

import * as History from '@/ducks/history';
import type { InvalidatorLookup, RootReducer, State } from '@/store/types';
import { getActionOrigin, storeLogger } from '@/store/utils';

import type { Transducer } from '../types';

export interface HistoryTransducerContext {
  isOwnAction: boolean;
}

export const cloneAction = ({ type, payload }: Action<any>) => ({ type, payload });

export const collectInvalidTransactions = (
  invalidatorLookup: InvalidatorLookup,
  state: State,
  subject: Action<any>
) => {
  const actionInvalidatorLookup = invalidatorLookup[subject.type];
  if (!actionInvalidatorLookup) return [];

  return [...History.undoTransactionsSelector(state), ...History.redoTransactionsSelector(state)].filter(
    (transaction) =>
      transaction.apply.some((origin) => {
        const invalidators = actionInvalidatorLookup[origin.type];
        if (!invalidators) return false;

        return invalidators.some((invalidator) => {
          try {
            return invalidator.invalidate(origin.payload, subject.payload);
          } catch (e) {
            storeLogger.error('failed to invalidate transaction', { origin, subject }, e);

            // if an invalidator fails then we should drop the transaction to be safe
            return true;
          }
        });
      })
  );
};

export const createHistoryTransducer =
  <A extends any[]>(
    getHistoryAction: (
      ...args: A
    ) => (state: State, action: Action<any>, context: HistoryTransducerContext) => Action<any> | null
  ) =>
  (getClientNodeID: () => string, ...args: A): Transducer<State> =>
  (rootReducer) =>
    ((state, action: Action<any>) => {
      const skipHistory = () => rootReducer(state, action);

      if (!state) return skipHistory();

      const origin = getActionOrigin(action);

      if (!origin) return skipHistory();

      const isOwnAction = origin === getClientNodeID();
      const historyAction = getHistoryAction(...args)(state, action, { isOwnAction });

      if (!historyAction) return skipHistory();

      const historyAppliedState = rootReducer(state, historyAction);
      return rootReducer(historyAppliedState, action);
    }) as RootReducer<State, AnyAction>;
