import { createRootCRUDReducer } from '@/ducks/utils/crudV2';

import { INITIAL_STATE } from '../constants';
import addDiagram from './addDiagram';
import addGlobalVariable from './addGlobalVariable';
import addManyGlobalVariables from './addManyGlobalVariables';
import crudReducers from './crud';
import patchDefaultStepColors from './patchDefaultStepColors';
import patchPublishing from './patchPublishing';
import patchSession from './patchSession';
import patchSettings from './patchSettings';
import removeDiagram from './removeDiagram';
import removeGlobalVariable from './removeGlobalVariable';
import removeManyGlobalVariables from './removeManyGlobalVariables';
import reorderComponents from './reorderComponents';
import reorderTopics from './reorderTopics';

const versionReducer = createRootCRUDReducer(INITIAL_STATE, crudReducers)
  .immerCase(...addDiagram)
  .immerCase(...removeDiagram)
  .immerCase(...addGlobalVariable)
  .immerCase(...addManyGlobalVariables)
  .immerCase(...removeGlobalVariable)
  .immerCase(...removeManyGlobalVariables)
  .immerCase(...patchPublishing)
  .immerCase(...patchSession)
  .immerCase(...patchSettings)
  .immerCase(...patchDefaultStepColors)
  .immerCase(...reorderTopics)
  .immerCase(...reorderComponents)
  .build();

export default versionReducer;
