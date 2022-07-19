import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Action } from 'typescript-fsa';

import * as Feature from '@/ducks/feature';
import * as History from '@/ducks/history';
import { isReplayAction } from '@/ducks/utils';
import { Middleware, State } from '@/store/types';
import { getActionOrigin, wrapOriginAction } from '@/store/utils';

import { ACTION_INVALIDATORS, ACTION_REVERTERS } from './constants';
import { InvalidatorLookup, ReverterLookup } from './types';

const cloneAction = ({ type, payload }: Action<any>) => ({ type, payload });

const collectInvalidTransactions = (invalidatorLookup: InvalidatorLookup, state: State, subject: Action<any>) => {
  const actionInvalidatorLookup = invalidatorLookup[subject.type];
  if (!actionInvalidatorLookup) return [];

  return [...History.undoTransactionsSelector(state), ...History.redoTransactionsSelector(state)].filter((transaction) =>
    transaction.apply.some((origin) => {
      const invalidators = actionInvalidatorLookup[origin.type];
      if (!invalidators) return false;

      return invalidators.some((invalidator) => invalidator.invalidate(origin.payload, subject.payload));
    })
  );
};

export const createHistoryMiddleware =
  (reverters: ReverterLookup, invalidatorLookup: InvalidatorLookup): Middleware =>
  (store) =>
  (next) =>
  (action) => {
    const state = store.getState();
    const isHistoryEnabled = Feature.isFeatureEnabledSelector(state)(Realtime.FeatureFlag.HISTORY_SYSTEM);
    const origin = getActionOrigin(action);

    if (!isHistoryEnabled || !origin) {
      next(action);
      return;
    }

    const clientNodeID = store.dispatch.getNodeID();
    const isOwnAction = origin === clientNodeID;
    if (!isOwnAction) {
      const invalid = collectInvalidTransactions(invalidatorLookup, state, action);
      if (invalid.length) {
        store.dispatch(History.dropTransactions({ transactionIDs: invalid.map(({ id }) => id) }));
      }

      next(action);
      return;
    }

    const revertActions = reverters[action.type]?.flatMap((reverter) => reverter.revert(action.payload, store.getState)) ?? [];
    if (isReplayAction(action) || !revertActions.length) {
      next(action);
      return;
    }

    store.dispatch(
      History.pushTransaction({
        transaction: {
          id: Utils.id.cuid(),
          apply: revertActions.map((revert) => wrapOriginAction(revert, clientNodeID)),
          revert: [wrapOriginAction(cloneAction(action), clientNodeID)],
        },
      })
    );

    next(action);
  };

export default [createHistoryMiddleware(ACTION_REVERTERS, ACTION_INVALIDATORS)];
