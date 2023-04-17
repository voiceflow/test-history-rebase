import { createRootReducer } from '@/ducks/utils';

import { INITIAL_STATE } from '../constants';
import addMany from './addMany';
import loadNote from './load';
import removeNote from './remove';
import upsertNote from './upsert';

const noteRootReducer = createRootReducer(INITIAL_STATE)
  .immerCase(...addMany)
  .immerCase(...loadNote)
  .immerCase(...removeNote)
  .immerCase(...upsertNote)
  .build();

export default noteRootReducer;
