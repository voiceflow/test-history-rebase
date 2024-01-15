import { createRootReducer } from '@/ducks/utils';

import { INITIAL_STATE } from '../constants';
import dropTransactions from './dropTransactions';
import flushTransaction from './flushTransaction';
import pushTransaction from './pushTransaction';
import redoTransaction from './redoTransaction';
import reset from './reset';
import startIgnoreTransactions from './startIgnoreTransactions';
import startTransaction from './startTransaction';
import stopIgnoreTransactions from './stopIgnoreTransactions';
import undoTransaction from './undoTransaction';

const projectHistoryReducer = createRootReducer(INITIAL_STATE)
  .immerCase(...pushTransaction)
  .immerCase(...dropTransactions)
  .immerCase(...flushTransaction)
  .immerCase(...redoTransaction)
  .immerCases(...reset)
  .immerCase(...startTransaction)
  .immerCase(...undoTransaction)
  .immerCase(...startIgnoreTransactions)
  .immerCase(...stopIgnoreTransactions)
  .build();

export default projectHistoryReducer;
