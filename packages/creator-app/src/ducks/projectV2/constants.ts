import { CRUD_INITIAL_STATE } from '@/ducks/utils/crudV2';

import { RealtimeProjectState } from './types';

export const STATE_KEY = 'projectV2';

export const PROJECT_INITIAL_STATE: RealtimeProjectState = {
  ...CRUD_INITIAL_STATE,
};
