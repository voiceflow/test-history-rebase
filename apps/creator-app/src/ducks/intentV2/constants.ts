import { createCRUDState } from '@/ducks/utils/crudV2';

import { IntentState } from './types';

export const STATE_KEY = 'intentV2';

export const INITIAL_STATE: IntentState = createCRUDState();
