import { createRootCRUDReducer } from '@/ducks/utils/crudV2';

import { INITIAL_STATE } from '../constants';
import addBlockReducer from './addBlock';
import {
  lockEntities,
  removeDiagram as awarenessRemoveDiagram,
  removeManyDiagrams as awarenessRemoveManyDiagrams,
  unlockEntities,
  updateLockedEntities,
} from './awareness';
import crudReducers from './crud';
import importSnapshotReducer from './importSnapshot';
import insertStepReducer from './insertStep';
import isolateStepsReducer from './isolateSteps';
import loadSharedNodesReducer from './loadSharedNodes';
import { addMenuItemReducer, removeMenuItemReducer, reorderMenuItemReducer, reorderMenuNodeReducer } from './menuItem';
import reloadSharedNodesReducer from './reloadSharedNodes';
import removeDiagramReducer from './removeDiagram';
import removeManyDiagramsReducer from './removeManyDiagrams';
import removeManyNodesReducer from './removeManyNodes';
import setLastCreatedIDReducer from './setLastCreatedID';
import { moveSubtopicReducer } from './subtopic';
import transplantStepsReducer from './transplantSteps';
import updateManyNodesDataReducer from './updateManyNodesData';
import { createCombinedReducer } from './utils';
import { addLocalVariable, removeLocalVariable } from './variables';

export * from './awareness';

const realtimeDiagramReducer = createRootCRUDReducer(INITIAL_STATE, {
  ...crudReducers,
  remove: createCombinedReducer(crudReducers.remove, awarenessRemoveDiagram, removeDiagramReducer),
  removeMany: createCombinedReducer(crudReducers.removeMany, removeManyDiagramsReducer, awarenessRemoveManyDiagrams),
})
  // variables
  .immerCase(...addLocalVariable)
  .immerCase(...removeLocalVariable)

  // menu item
  .immerCase(...addMenuItemReducer)
  .immerCase(...removeMenuItemReducer)
  .immerCase(...reorderMenuItemReducer)
  .immerCase(...reorderMenuNodeReducer)

  // nodes
  .immerCase(...addBlockReducer)
  .immerCase(...insertStepReducer)
  .immerCase(...isolateStepsReducer)
  .immerCase(...importSnapshotReducer)
  .immerCase(...transplantStepsReducer)
  .immerCase(...removeManyNodesReducer)
  .immerCase(...loadSharedNodesReducer)
  .immerCase(...reloadSharedNodesReducer)
  .immerCase(...updateManyNodesDataReducer)

  // locks
  .immerCase(...lockEntities)
  .immerCase(...unlockEntities)
  .immerCase(...updateLockedEntities)

  // subtopics
  .immerCase(...moveSubtopicReducer)

  // other
  .immerCase(...setLastCreatedIDReducer)

  .build();

export default realtimeDiagramReducer;
