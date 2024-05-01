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
  .mimerCase(...pushTransaction)
  .mimerCase(...dropTransactions)
  .mimerCase(...flushTransaction)
  .mimerCase(...redoTransaction)
  .immerCases(...reset)
  .mimerCase(...startTransaction)
  .mimerCase(...undoTransaction)
  .mimerCase(...startIgnoreTransactions)
  .mimerCase(...stopIgnoreTransactions)
  .build();

export default projectHistoryReducer;
