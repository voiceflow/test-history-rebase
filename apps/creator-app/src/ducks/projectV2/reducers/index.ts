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
  .mimerCase(...updatePlatformData)
  .mimerCase(...addManyCustomThemes)
  .mimerCase(...toggleWorkspaceProjectsAiAssistOff)

  // viewers
  .mimerCase(...loadViewers)
  .mimerCase(...updateVendor)
  .mimerCase(...updateViewers)
  .mimerCase(...updateDiagramViewers)

  // members
  .mimerCase(...addMember)
  .mimerCase(...patchMember)
  .mimerCase(...removeMember)
  .mimerCase(...patchWorkspaceMember)
  .mimerCase(...removeWorkspaceMember)

  .build();

export default realtimeProjectReducer;
