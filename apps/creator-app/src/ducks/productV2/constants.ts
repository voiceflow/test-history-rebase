import { createCRUDState } from '@/ducks/utils/crudV2';

import { ProductState } from './types';

export const STATE_KEY = 'productV2';

export const INITIAL_STATE: ProductState = createCRUDState();
