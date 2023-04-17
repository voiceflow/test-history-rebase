import { createRootCRUDReducer } from '@/ducks/utils/crudV2';

import { INITIAL_STATE } from '../constants';
import addDiagram from './addDiagram';
import addGlobalVariable from './addGlobalVariable';
import addManyComponents from './addManyComponents';
import addManyGlobalVariables from './addManyGlobalVariables';
import crudReducers from './crud';
import patchDefaultStepColors from './patchDefaultStepColors';
import patchPublishing from './patchPublishing';
import patchSession from './patchSession';
import patchSettings from './patchSettings';
import reloadFolders from './reloadFolders';
import reloadGlobalVariables from './reloadGlobalVariables';
import removeDiagram from './removeDiagram';
import removeGlobalVariable from './removeGlobalVariable';
import removeManyDiagrams from './removeManyDiagrams';
import removeManyGlobalVariables from './removeManyGlobalVariables';
import reorderComponents from './reorderComponents';

const versionReducer = createRootCRUDReducer(INITIAL_STATE, crudReducers)
  .immerCase(...addDiagram)
  .immerCase(...removeDiagram)
  .immerCase(...removeManyDiagrams)
  .immerCase(...addGlobalVariable)
  .immerCase(...addManyGlobalVariables)
  .immerCase(...removeGlobalVariable)
  .immerCase(...removeManyGlobalVariables)
  .immerCase(...patchPublishing)
  .immerCase(...patchSession)
  .immerCase(...patchSettings)
  .immerCase(...patchDefaultStepColors)
  .immerCase(...reorderComponents)
  .immerCase(...reloadGlobalVariables)
  .immerCase(...reloadFolders)
  .immerCase(...addManyComponents)
  .build();

export default versionReducer;
