import { CRUD_INITIAL_STATE } from '@/ducks/utils/crudV2';

import { RealtimeWorkspaceState } from './types';

export { UNKNOWN_MEMBER_DATA } from '@/ducks/workspace/constants';

export const STATE_KEY = 'workspaceV2';

export const WORKSPACE_INITIAL_STATE: RealtimeWorkspaceState = {
  ...CRUD_INITIAL_STATE,
};

export const TEMPLATES_ADMIN_ID = 36745;
export const TEMPLATES_EDITORS_ID = [3600, 27497];
