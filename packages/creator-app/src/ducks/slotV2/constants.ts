import { createCRUDState } from '@/ducks/utils/crudV2';

import { SlotState } from './types';

export const STATE_KEY = 'slotV2';

export const INITIAL_STATE: SlotState = createCRUDState();
