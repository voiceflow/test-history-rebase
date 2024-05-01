import { createRootCRUDReducer } from '@/ducks/utils/crudV2';

import { INITIAL_STATE } from '../constants';
import changeSeats from './changeSeats';
import crudReducers from './crud';
import leave from './leave';
import { addMember, cancelInvite, patchMember, removeMember, replaceMembers, updateInvite } from './member';
import { loadAllQuotas, replaceQuota } from './quotas';
import { patchSettings, replaceSettings, toggleDashboardKanban } from './settings';
import updateImage from './updateImage';
import updateName from './updateName';

const realtimeWorkspaceReducer = createRootCRUDReducer(INITIAL_STATE, crudReducers)
  .mimerCase(...leave)
  .mimerCase(...updateName)
  .mimerCase(...updateImage)
  .mimerCase(...changeSeats)

  // settings
  .mimerCase(...patchSettings)
  .mimerCase(...toggleDashboardKanban)
  .mimerCase(...replaceSettings)

  // quotas
  .mimerCase(...replaceQuota)
  .mimerCase(...loadAllQuotas)

  // members
  .immerCases(...updateInvite)
  .mimerCase(...addMember)
  .mimerCase(...patchMember)
  .mimerCase(...cancelInvite)
  .mimerCase(...removeMember)
  .mimerCase(...replaceMembers)
  .build();

export default realtimeWorkspaceReducer;
