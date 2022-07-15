import { createRootCRUDReducer } from '@/ducks/utils/crudV2';

import { INITIAL_STATE } from '../constants';
import {
  loadViewers,
  lockEntities,
  removeDiagram as awarenessRemoveDiagram,
  unlockEntities,
  updateDiagramViewers,
  updateLockedEntities,
} from './awareness';
import crudReducers from './crud';
import {
  addIntentSteps,
  loadIntentSteps,
  reloadIntentSteps,
  removeDiagram as intentStepRemoveDiagram,
  removeIntentSteps,
  reorderIntentSteps,
  updateIntentSteps,
} from './intentSteps';
import { addNewStartingBlocks, loadStartingBlocks, removeDiagramStartingBlocks, removeStartingBlocks, updateStartingBlock } from './startingBlocks';
import { createCombinedReducer } from './utils';
import { addLocalVariable, removeLocalVariable } from './variables';

export * from './awareness';

const realtimeDiagramReducer = createRootCRUDReducer(INITIAL_STATE, {
  ...crudReducers,
  remove: createCombinedReducer(crudReducers.remove, awarenessRemoveDiagram, intentStepRemoveDiagram),
})
  .immerCase(...addLocalVariable)
  .immerCase(...removeLocalVariable)
  .immerCase(...removeIntentSteps)
  .immerCase(...addIntentSteps)
  .immerCase(...loadIntentSteps)
  .immerCase(...loadStartingBlocks)
  .immerCase(...addNewStartingBlocks)
  .immerCase(...removeStartingBlocks)
  .immerCase(...updateStartingBlock)
  .immerCase(...removeDiagramStartingBlocks)
  .immerCase(...reorderIntentSteps)
  .immerCase(...updateIntentSteps)
  .immerCase(...loadViewers)
  .immerCase(...updateDiagramViewers)
  .immerCase(...reloadIntentSteps)
  .immerCase(...lockEntities)
  .immerCase(...unlockEntities)
  .immerCase(...updateLockedEntities)
  .build();

export default realtimeDiagramReducer;
