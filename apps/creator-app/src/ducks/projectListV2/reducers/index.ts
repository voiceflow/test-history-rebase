import { createRootCRUDReducer } from '@/ducks/utils/crudV2';

import { INITIAL_STATE } from '../constants';
import addProjectToListReducer from './addProjectToList';
import crudReducers from './crud';
import removeProject from './removeProject';
import removeProjectFromListReducer from './removeProjectFromList';
import transplantProjectBetweenListsReducer from './transplantProjectBetweenLists';

const realtimeProjectListReducer = createRootCRUDReducer(INITIAL_STATE, crudReducers)
  .immerCase(...transplantProjectBetweenListsReducer)
  .immerCase(...addProjectToListReducer)
  .immerCase(...removeProjectFromListReducer)
  .immerCase(...removeProject)
  .build();

export default realtimeProjectListReducer;
