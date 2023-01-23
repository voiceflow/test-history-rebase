import { createRootCRUDReducer } from '@/ducks/utils/crudV2';

import { INITIAL_STATE } from '../constants';
import addManyCustomThemes from './addManyCustomThemes';
import { loadViewers, updateDiagramViewers, updateViewers } from './awareness';
import crudReducers from './crud';
import toggleWorkspaceProjectsAiAssistOff from './toggleWorkspaceProjectsAiAssistOff';
import updatePlatformData from './updatePlatformData';
import updateVendor from './updateVendor';

const realtimeProjectReducer = createRootCRUDReducer(INITIAL_STATE, crudReducers)
  .immerCase(...loadViewers)
  .immerCase(...updateVendor)
  .immerCase(...updateViewers)
  .immerCase(...addManyCustomThemes)
  .immerCase(...updatePlatformData)
  .immerCase(...updateDiagramViewers)
  .immerCase(...toggleWorkspaceProjectsAiAssistOff)
  .build();

export default realtimeProjectReducer;
