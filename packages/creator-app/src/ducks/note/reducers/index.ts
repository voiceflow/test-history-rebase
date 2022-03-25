import { createRootReducer } from '@/ducks/utils';

import { INITIAL_STATE } from '../constants';
import loadNote from './load';
import removeNote from './remove';
import upsertNote from './upsert';

const noteRootReducer = createRootReducer(INITIAL_STATE)
  .immerCase(...loadNote)
  .immerCase(...removeNote)
  .immerCase(...upsertNote)
  .build();

export default noteRootReducer;
