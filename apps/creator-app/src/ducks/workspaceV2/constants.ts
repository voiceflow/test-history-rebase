import { createCRUDState } from '@/ducks/utils/crudV2';

import { WorkspaceState } from './types';

export { UNKNOWN_MEMBER_DATA } from '@/ducks/workspace/constants';

export const STATE_KEY = 'workspaceV2';

export const INITIAL_STATE: WorkspaceState = createCRUDState();
