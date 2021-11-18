import { createRootCRUDReducer } from '@/ducks/utils/crudV2';

import { INITIAL_STATE } from '../constants';
import { DiagramState } from '../types';
import addIntentSteps from './addIntentSteps';
import addLocalVariable from './addLocalVariable';
import { loadViewersReducer, updateDiagramViewers } from './awareness';
import crudReducers from './crud';
import loadIntentSteps from './loadIntentSteps';
import reloadIntentSteps from './reloadIntentSteps';
import removeDiagram from './remove';
import removeIntentSteps from './removeIntentSteps';
import removeLocalVariable from './removeLocalVariable';
import reorderIntentSteps from './reorderIntentSteps';
import updateIntentSteps from './updateIntentSteps';

export * from './awareness';

const realtimeDiagramReducer = createRootCRUDReducer<DiagramState>(INITIAL_STATE, crudReducers)
  .immerCase(...removeDiagram)
  .immerCase(...addLocalVariable)
  .immerCase(...removeLocalVariable)
  .immerCase(...removeIntentSteps)
  .immerCase(...addIntentSteps)
  .immerCase(...loadIntentSteps)
  .immerCase(...reorderIntentSteps)
  .immerCase(...updateIntentSteps)
  .immerCase(...loadViewersReducer)
  .immerCase(...updateDiagramViewers)
  .immerCase(...reloadIntentSteps)
  .build();

export default realtimeDiagramReducer;
