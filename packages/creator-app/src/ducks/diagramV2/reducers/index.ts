import { createRootCRUDReducer } from '@/ducks/utils/crudV2';

import { INITIAL_STATE } from '../constants';
import { DiagramState } from '../types';
import addLocalVariable from './addLocalVariable';
import { loadViewersReducer, updateDiagramViewers } from './awareness';
import crudReducers from './crud';
import removeLocalVariable from './removeLocalVariable';

export * from './awareness';

const realtimeDiagramReducer = createRootCRUDReducer<DiagramState>(INITIAL_STATE, crudReducers)
  .immerCase(...addLocalVariable)
  .immerCase(...removeLocalVariable)
  .immerCase(...loadViewersReducer)
  .immerCase(...updateDiagramViewers)
  .build();

export default realtimeDiagramReducer;
