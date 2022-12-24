import { createRootCRUDReducer } from '@/ducks/utils/crudV2';

import { INITIAL_STATE } from '../constants';
import crudReducers from './crud';
import leave from './leave';
import { addMember, cancelInvite, patchMember, removeMember, replaceMembers, updateInvite } from './member';
import { loadAllQuotas, replaceQuota } from './quotas';
import { patchSettings, replaceSettings } from './settings';
import updateImage from './updateImage';
import updateName from './updateName';

const realtimeWorkspaceReducer = createRootCRUDReducer(INITIAL_STATE, crudReducers)
  .immerCase(...cancelInvite)
  .immerCase(...updateInvite)
  .immerCase(...addMember)
  .immerCase(...patchMember)
  .immerCase(...removeMember)
  .immerCase(...replaceMembers)
  .immerCase(...leave)
  .immerCase(...updateImage)
  .immerCase(...updateName)
  .immerCase(...loadAllQuotas)
  .immerCase(...replaceQuota)
  .immerCase(...patchSettings)
  .immerCase(...replaceSettings)
  .build();

export default realtimeWorkspaceReducer;
