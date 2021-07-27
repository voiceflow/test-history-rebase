import { UserRole } from '@voiceflow/internal';

import * as CRUD from '@/ducks/utils/crud';
import { DBMember } from '@/models';

import { WorkspaceState } from './types';

export const STATE_KEY = 'workspace';

export const INITIAL_STATE: Omit<WorkspaceState, 'activeWorkspaceID'> = {
  ...CRUD.INITIAL_STATE,
};

export const UNKNOWN_MEMBER_DATA: DBMember = {
  creator_id: 0,
  seats: 0,
  name: 'User Unavailable',
  email: 'User Unavailable',
  role: UserRole.VIEWER,
  image: '8DA2B5|F2F5F7',
  created: '',
  status: null,
};

export const TEMPLATES_ADMIN_ID = 36745;
export const TEMPLATES_EDITORS_ID = [3600, 27497];
