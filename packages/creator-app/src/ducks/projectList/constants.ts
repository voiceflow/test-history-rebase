import { createCRUDState } from '@/ducks/utils/crud';

import { ProjectListState } from './types';

export const STATE_KEY = 'projectList';

export const INITIAL_STATE: ProjectListState = createCRUDState();
