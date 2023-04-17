import { createRootCRUDReducer } from '@/ducks/utils/crudV2';

import { INITIAL_STATE } from '../constants';
import crudReducers from './crud';
import reloadReducer from './reload';
import removeManyUtterancesReducer from './removeManyUtterances';
import updateManyUtterancesReducer from './updateManyUtterances';

const nluReducer = createRootCRUDReducer(INITIAL_STATE, crudReducers)
  .immerCase(...reloadReducer)
  .immerCase(...removeManyUtterancesReducer)
  .immerCase(...updateManyUtterancesReducer)
  .build();

export default nluReducer;
