import { CRUD_INITIAL_STATE } from '@/ducks/utils/crudV2';

import { RealtimeProjectListState } from './types';

export const STATE_KEY = 'projectListV2';

export const PROJECT_LIST_INITIAL_STATE: RealtimeProjectListState = {
  ...CRUD_INITIAL_STATE,
};
