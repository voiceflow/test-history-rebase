import { createRootCRUDReducer } from '@/ducks/utils/crudV2';

import { INITIAL_STATE } from '../constants';
import { ProjectListState } from '../types';
import addProjectToListReducer from './addProjectToList';
import crudReducers from './crud';
import removeProjectFromListReducer from './removeProjectFromList';
import transplantProjectBetweenListsReducer from './transplantProjectBetweenLists';

const realtimeProjectListReducer = createRootCRUDReducer<ProjectListState>(INITIAL_STATE, crudReducers)
  .immerCase(...transplantProjectBetweenListsReducer)
  .immerCase(...addProjectToListReducer)
  .immerCase(...removeProjectFromListReducer)
  .build();

export default realtimeProjectListReducer;
