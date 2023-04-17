import { createCRUDState } from '@/ducks/utils/crudV2';

import { CustomBlockState } from './types';

export const STATE_KEY = 'customBlock';

export const INITIAL_STATE: CustomBlockState = createCRUDState();
