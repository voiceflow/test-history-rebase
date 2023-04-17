import { createCRUDState } from '@/ducks/utils/crudV2';

import { NLUState } from './types';

export const STATE_KEY = 'nlu';

export const INITIAL_STATE: NLUState = createCRUDState();
