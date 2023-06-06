import { createRootCRUDReducer } from '@/ducks/utils/crudV2';

import { INITIAL_STATE } from '../constants';
import changeSeats from './changeSeats';
import crudReducers from './crud';
import leave from './leave';
import { addMember, cancelInvite, patchMember, removeMember, replaceMembers, updateInvite } from './member';
import { loadAllQuotas, replaceQuota } from './quotas';
import { patchSettings, replaceSettings } from './settings';
import updateImage from './updateImage';
import updateName from './updateName';

const realtimeWorkspaceReducer = createRootCRUDReducer(INITIAL_STATE, crudReducers)
  .immerCase(...leave)
  .immerCase(...updateName)
  .immerCase(...updateImage)
  .immerCase(...changeSeats)

  // settings
  .immerCase(...patchSettings)
  .immerCase(...replaceSettings)

  // quotas
  .immerCase(...replaceQuota)
  .immerCase(...loadAllQuotas)

  // members
  .immerCases(...updateInvite)
  .immerCase(...addMember)
  .immerCase(...patchMember)
  .immerCase(...cancelInvite)
  .immerCase(...removeMember)
  .immerCase(...replaceMembers)
  .build();

export default realtimeWorkspaceReducer;
