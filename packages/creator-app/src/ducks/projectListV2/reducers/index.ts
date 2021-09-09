import { createRootCRUDReducer } from '@/ducks/utils/crudV2';

import { PROJECT_LIST_INITIAL_STATE } from '../constants';
import { RealtimeProjectListState } from '../types';
import crudReducers from './crud';
import transplantProjectBetweenListsReducer from './transplantProjectBetweenLists';

const realtimeProjectListReducer = createRootCRUDReducer<RealtimeProjectListState>(PROJECT_LIST_INITIAL_STATE, crudReducers)
  .immerCase(...transplantProjectBetweenListsReducer)
  .build();

export default realtimeProjectListReducer;
