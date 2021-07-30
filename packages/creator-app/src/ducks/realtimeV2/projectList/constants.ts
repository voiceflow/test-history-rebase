import { CRUD_INITIAL_STATE } from '../utils/crud';
import { RealtimeProjectListState } from './types';

export const PROJECT_LIST_STATE_KEY = 'projectList';

export const PROJECT_LIST_INITIAL_STATE: RealtimeProjectListState = {
  ...CRUD_INITIAL_STATE,
};
