import { CRUD_INITIAL_STATE } from '../utils';
import { RealtimeProjectState } from './types';

export const PROJECT_STATE_KEY = 'project';

export const PROJECT_INITIAL_STATE: RealtimeProjectState = {
  ...CRUD_INITIAL_STATE,
};
