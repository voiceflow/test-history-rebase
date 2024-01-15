import { createSelector } from 'reselect';

import { createRootSelector } from '@/ducks/utils';

import { STATE_KEY } from './constants';

export const rootHistorySelector = createRootSelector(STATE_KEY);

export const undoTransactionsSelector = createSelector([rootHistorySelector], ({ undo }) => undo);

export const redoTransactionsSelector = createSelector([rootHistorySelector], ({ redo }) => redo);

export const latestUndoTransactionSelector = createSelector([undoTransactionsSelector], (undo) => (undo.length ? undo[undo.length - 1] : null));

export const latestRedoTransactionSelector = createSelector([redoTransactionsSelector], (redo) => (redo.length ? redo[redo.length - 1] : null));

export const shouldIgnoreTransactionsSelector = createSelector([rootHistorySelector], ({ ignore }) => !!ignore.length);
