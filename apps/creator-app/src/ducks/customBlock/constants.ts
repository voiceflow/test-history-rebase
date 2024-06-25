import { createCRUDState } from '@/ducks/utils/crudV2';

import type { CustomBlockState } from './types';

export const STATE_KEY = 'customBlock';

export const INITIAL_STATE: CustomBlockState = createCRUDState();
