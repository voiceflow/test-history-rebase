import { UserRole } from '@voiceflow/internal';
import * as Realtime from '@voiceflow/realtime-sdk';

import { createCRUDState } from '@/ducks/utils/crudV2';

import { WorkspaceState } from './types';

export const STATE_KEY = 'workspaceV2';

export const INITIAL_STATE: WorkspaceState = createCRUDState();

export const UNKNOWN_MEMBER_DATA: Realtime.WorkspaceMember = {
  creator_id: 0,
  role: UserRole.VIEWER,
  name: 'User Unavailable',
  email: 'User Unavailable',
  image: '8DA2B5|F2F5F7',
  created: '',
};
