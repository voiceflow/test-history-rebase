import { createRootCRUDReducer } from '@/ducks/utils/crudV2';

import { INITIAL_STATE } from '../constants';
import crudReducers from './crud';
import leave from './leave';
import addMember from './member/addMember';
import cancelInvite from './member/cancelInvite';
import patchMember from './member/patchMember';
import removeMember from './member/removeMember';
import replaceMembers from './member/replaceMembers';
import updateInvite from './member/updateInvite';
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
  .build();

export default realtimeWorkspaceReducer;
