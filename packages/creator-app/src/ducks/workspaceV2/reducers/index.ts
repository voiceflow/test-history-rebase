import { createRootCRUDReducer } from '@/ducks/utils/crudV2';

import { INITIAL_STATE } from '../constants';
import crudReducers from './crud';
import leave from './leave';
import { addMember, cancelInvite, patchMember, removeMember, replaceMembers, updateInvite } from './member';
import { loadAllQuotas, replaceQuota } from './quotas';
import { patchSettings, replaceSettings, toggleDashboardKanban } from './settings';
import updateImage from './updateImage';
import updateName from './updateName';

const realtimeWorkspaceReducer = createRootCRUDReducer(INITIAL_STATE, crudReducers)
  .immerCase(...leave)
  .immerCase(...updateName)
  .immerCase(...updateImage)

  // settings
  .immerCase(...patchSettings)
  .immerCase(...toggleDashboardKanban)
  .immerCase(...replaceSettings)

  // quotas
  .immerCase(...replaceQuota)
  .immerCase(...loadAllQuotas)

  // members
  .immerCase(...addMember)
  .immerCase(...patchMember)
  .immerCase(...cancelInvite)
  .immerCase(...updateInvite)
  .immerCase(...removeMember)
  .immerCase(...replaceMembers)
  .build();

export default realtimeWorkspaceReducer;
