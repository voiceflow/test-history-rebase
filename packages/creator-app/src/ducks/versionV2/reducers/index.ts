import { createRootCRUDReducer } from '@/ducks/utils/crudV2';

import { INITIAL_STATE } from '../constants';
import { VersionState } from '../types';
import addGlobalVariable from './addGlobalVariable';
import crudReducers from './crud';
import patchPublishing from './patchPublishing';
import patchSession from './patchSession';
import patchSettings from './patchSettings';
import removeGlobalVariable from './removeGlobalVariable';

const versionReducer = createRootCRUDReducer<VersionState>(INITIAL_STATE, crudReducers)
  .immerCase(...addGlobalVariable)
  .immerCase(...removeGlobalVariable)
  .immerCase(...patchPublishing)
  .immerCase(...patchSession)
  .immerCase(...patchSettings)
  .build();

export default versionReducer;
