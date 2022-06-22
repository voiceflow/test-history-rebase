import { Eventual, Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { toast } from '@voiceflow/ui';
import { batch } from 'react-redux';

import * as Creator from '@/ducks/creator';
import * as Feature from '@/ducks/feature';
import { wrapReplayAction } from '@/ducks/utils';
import { Thunk } from '@/store/types';

import { flushTransaction, redoTransaction, startTransaction, undoTransaction } from './actions';
import { latestRedoTransactionSelector, latestUndoTransactionSelector } from './selectors';

export const transaction =
  (callback: () => Eventual<any>): Thunk =>
  async (dispatch) => {
    const transactionID = Utils.id.cuid();
    dispatch.local(startTransaction({ transactionID }));

    try {
      // eslint-disable-next-line callback-return
      await callback();
    } finally {
      dispatch.local(flushTransaction({ transactionID }));
    }
  };

export const undo = (): Thunk => (dispatch, getState) => {
  const state = getState();
  const isHistoryEnabled = Feature.isFeatureEnabledSelector(state)(Realtime.FeatureFlag.HISTORY_SYSTEM);
  let promise = Promise.resolve();

  if (!isHistoryEnabled) {
    dispatch(Creator.undoHistory());
    return promise;
  }

  const transaction = latestUndoTransactionSelector(state);

  if (!transaction) {
    toast.error('No actions left to undo');
    return promise;
  }

  batch(() => {
    promise = Promise.all(transaction.apply.map((action) => dispatch.sync(wrapReplayAction(action)))).then(Utils.functional.noop);
    dispatch.local(undoTransaction({ transactionID: transaction.id, revertID: Utils.id.cuid() }));
  });

  return promise;
};

export const redo = (): Thunk => (dispatch, getState) => {
  const state = getState();
  const isHistoryEnabled = Feature.isFeatureEnabledSelector(state)(Realtime.FeatureFlag.HISTORY_SYSTEM);
  let promise = Promise.resolve();

  if (!isHistoryEnabled) {
    dispatch(Creator.redoHistory());
    return promise;
  }

  const transaction = latestRedoTransactionSelector(state);

  if (!transaction) {
    toast.error('No actions left to redo');
    return promise;
  }

  batch(() => {
    promise = Promise.all(transaction.apply.map((action) => dispatch.sync(wrapReplayAction(action)))).then(Utils.functional.noop);
    dispatch.local(redoTransaction({ transactionID: transaction.id, revertID: Utils.id.cuid() }));
  });

  return promise;
};
