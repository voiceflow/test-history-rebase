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
import insertManyStepsReducer from './insertManySteps';
import insertStepReducer from './insertStep';
import isolateStepsReducer from './isolateSteps';
import loadSharedNodesReducer from './loadSharedNodes';
import { addMenuItemReducer, removeMenuItemReducer, reorderMenuItemReducer } from './menuItem';
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
  .mimerCase(...addLocalVariable)
  .mimerCase(...removeLocalVariable)

  // menu item
  .mimerCase(...addMenuItemReducer)
  .mimerCase(...removeMenuItemReducer)
  .mimerCase(...reorderMenuItemReducer)

  // nodes
  .mimerCase(...addBlockReducer)
  .mimerCase(...insertStepReducer)
  .mimerCase(...isolateStepsReducer)
  .mimerCase(...importSnapshotReducer)
  .mimerCase(...insertManyStepsReducer)
  .mimerCase(...transplantStepsReducer)
  .mimerCase(...removeManyNodesReducer)
  .mimerCase(...loadSharedNodesReducer)
  .mimerCase(...reloadSharedNodesReducer)
  .mimerCase(...updateManyNodesDataReducer)

  // locks
  .mimerCase(...lockEntities)
  .mimerCase(...unlockEntities)
  .mimerCase(...updateLockedEntities)

  // subtopics
  .mimerCase(...moveSubtopicReducer)

  // other
  .mimerCase(...setLastCreatedIDReducer)

  .build();

export default realtimeDiagramReducer;
