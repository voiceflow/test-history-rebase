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
import reloadSharedNodesReducer from './reloadSharedNodes';
import removeDiagramReducer from './removeDiagram';
import removeManyDiagramsReducer from './removeManyDiagrams';
import removeManyNodesReducer from './removeManyNodes';
import reorderMenuNodeReducer from './reorderMenuNode';
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
  .immerCase(...addLocalVariable)
  .immerCase(...removeLocalVariable)
  .immerCase(...lockEntities)
  .immerCase(...unlockEntities)
  .immerCase(...updateLockedEntities)
  .immerCase(...addBlockReducer)
  .immerCase(...importSnapshotReducer)
  .immerCase(...insertStepReducer)
  .immerCase(...isolateStepsReducer)
  .immerCase(...transplantStepsReducer)
  .immerCase(...loadSharedNodesReducer)
  .immerCase(...reloadSharedNodesReducer)
  .immerCase(...removeManyNodesReducer)
  .immerCase(...reorderMenuNodeReducer)
  .immerCase(...updateManyNodesDataReducer)
  .build();

export default realtimeDiagramReducer;
