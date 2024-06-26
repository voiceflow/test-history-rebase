import type { Eventual } from '@voiceflow/common';
import { Utils } from '@voiceflow/common';
import { toast } from '@voiceflow/ui';

import { wrapReplayAction } from '@/ducks/utils';
import type { Thunk } from '@/store/types';

import {
  flushTransaction,
  redoTransaction,
  startIgnoreTransactions,
  startTransaction,
  stopIgnoreTransactions,
  undoTransaction,
} from './actions';
import { latestRedoTransactionSelector, latestUndoTransactionSelector } from './selectors';

export const transaction =
  (callback: () => Eventual<any>): Thunk =>
  async (dispatch) => {
    const transactionID = Utils.id.cuid();
    dispatch(startTransaction({ transactionID }));

    try {
      // eslint-disable-next-line callback-return
      await callback();
    } finally {
      dispatch(flushTransaction({ transactionID }));
    }
  };

export const ignore =
  (callback: () => Eventual<any>): Thunk =>
  async (dispatch) => {
    const ignoreID = Utils.id.cuid();
    dispatch(startIgnoreTransactions({ ignoreID }));

    try {
      // eslint-disable-next-line callback-return
      await callback();
    } finally {
      dispatch(stopIgnoreTransactions({ ignoreID }));
    }
  };

export const undo = (): Thunk => (dispatch, getState) => {
  const state = getState();
  let promise = Promise.resolve();

  const transaction = latestUndoTransactionSelector(state);

  if (!transaction) {
    toast.error('No actions left to undo');
    return promise;
  }

  promise = Promise.all(transaction.apply.map((action) => dispatch.sync(wrapReplayAction(action)))).then(
    Utils.functional.noop
  );
  dispatch(undoTransaction({ transactionID: transaction.id, revertID: Utils.id.cuid() }));

  return promise;
};

export const redo = (): Thunk => (dispatch, getState) => {
  const state = getState();
  let promise = Promise.resolve();

  const transaction = latestRedoTransactionSelector(state);

  if (!transaction) {
    toast.error('No actions left to redo');
    return promise;
  }

  promise = Promise.all(transaction.apply.map((action) => dispatch.sync(wrapReplayAction(action)))).then(
    Utils.functional.noop
  );
  dispatch(redoTransaction({ transactionID: transaction.id, revertID: Utils.id.cuid() }));

  return promise;
};
