import { createRootCRUDReducer } from '@/ducks/utils/crudV2';

import { INITIAL_STATE } from '../constants';
import addManyCustomThemes from './addManyCustomThemes';
import { loadViewers, updateDiagramViewers, updateViewers } from './awareness';
import crudReducers from './crud';
import { addMember, patchMember, patchWorkspaceMember, removeMember, removeWorkspaceMember } from './member';
import toggleWorkspaceProjectsAiAssistOff from './toggleWorkspaceProjectsAiAssistOff';
import updatePlatformData from './updatePlatformData';
import updateVendor from './updateVendor';

const realtimeProjectReducer = createRootCRUDReducer(INITIAL_STATE, crudReducers)
  .immerCase(...updatePlatformData)
  .immerCase(...addManyCustomThemes)
  .immerCase(...toggleWorkspaceProjectsAiAssistOff)

  // viewers
  .immerCase(...loadViewers)
  .immerCase(...updateVendor)
  .immerCase(...updateViewers)
  .immerCase(...updateDiagramViewers)

  // members
  .immerCase(...addMember)
  .immerCase(...patchMember)
  .immerCase(...removeMember)
  .immerCase(...patchWorkspaceMember)
  .immerCase(...removeWorkspaceMember)

  .build();

export default realtimeProjectReducer;
