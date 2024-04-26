import { Utils } from '@voiceflow/common';

import { STATE_KEY } from './constants';
import type { Transaction } from './types';

export const historyType = Utils.protocol.typeFactory(STATE_KEY);

export interface TransactionPayload {
  transactionID: string;
}

export interface PushTransactionPayload {
  transaction: Transaction;
}

export interface DropTransactionsPayload {
  transactionIDs: string[];
}

export interface RevertTransactionPayload extends TransactionPayload {
  revertID: string;
}

export interface IgnoreTransactionsPayload {
  ignoreID: string;
}

export const startTransaction = Utils.protocol.createAction<TransactionPayload>(historyType('START_TRANSACTION'));
export const pushTransaction = Utils.protocol.createAction<PushTransactionPayload>(historyType('PUSH_TRANSACTION'));
export const dropTransactions = Utils.protocol.createAction<DropTransactionsPayload>(historyType('DROP_TRANSACTIONS'));
export const undoTransaction = Utils.protocol.createAction<RevertTransactionPayload>(historyType('UNDO_TRANSACTION'));
export const redoTransaction = Utils.protocol.createAction<RevertTransactionPayload>(historyType('REDO_TRANSACTION'));
export const flushTransaction = Utils.protocol.createAction<TransactionPayload>(historyType('FLUSH_TRANSACTION'));
export const startIgnoreTransactions = Utils.protocol.createAction<IgnoreTransactionsPayload>(
  historyType('START_IGNORE_TRANSACTIONS')
);
export const stopIgnoreTransactions = Utils.protocol.createAction<IgnoreTransactionsPayload>(
  historyType('STOP_IGNORE_TRANSACTIONS')
);
