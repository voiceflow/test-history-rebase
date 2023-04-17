import { createCRUDState } from '@/ducks/utils/crudV2';

import { VariableStateCRUDState } from './types';

export const STATE_KEY = 'variableState';

export const ALL_PROJECT_VARIABLES_ID = 'all_project_variables';

export const INITIAL_STATE: VariableStateCRUDState = createCRUDState();
