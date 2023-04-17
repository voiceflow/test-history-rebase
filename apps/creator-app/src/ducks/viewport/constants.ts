import { createCRUDState } from '@/ducks/utils/crudV2';

import { ViewportState } from './types';

export const STATE_KEY = 'viewport';

export const INITIAL_STATE: ViewportState = createCRUDState();
