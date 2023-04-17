import { createCRUDState } from '@/ducks/utils/crudV2';

import { ProjectListState } from './types';

export const STATE_KEY = 'projectListV2';

export const INITIAL_STATE: ProjectListState = createCRUDState();
