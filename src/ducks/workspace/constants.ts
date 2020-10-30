import { UserRole } from '@/constants';
import { DBWorkspace } from '@/models';

import { WorkspaceState } from './types';

export class NoValidTemplateError extends Error {
  constructor() {
    super('no valid template exists');
  }
}

export const STATE_KEY = 'workspace';

export const INITIAL_STATE: WorkspaceState = {
  allIds: [],
  byId: {},
  activeWorkspaceID: localStorage.getItem('team'),
};

export const UNKNOWN_MEMBER_DATA: DBWorkspace.Member = {
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
export const TEMPLATES_EDITORS_ID = [3600];
