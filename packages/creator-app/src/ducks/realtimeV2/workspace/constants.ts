import { UserRole } from '@voiceflow/internal';

import { DBMember } from '@/models';

import { CRUD_INITIAL_STATE } from '../utils';
import { RealtimeWorkspaceState } from './types';

export const WORKSPACE_STATE_KEY = 'workspace';

export const WORKSPACE_INITIAL_STATE: RealtimeWorkspaceState = {
  ...CRUD_INITIAL_STATE,
};

export const UNKNOWN_MEMBER_DATA: DBMember = {
  role: UserRole.VIEWER,
  name: 'User Unavailable',
  email: 'User Unavailable',
  seats: 0,
  image: '8DA2B5|F2F5F7',
  status: null,
  created: '',
  creator_id: 0,
};

export const TEMPLATES_ADMIN_ID = 36745;
export const TEMPLATES_EDITORS_ID = [3600, 27497];
