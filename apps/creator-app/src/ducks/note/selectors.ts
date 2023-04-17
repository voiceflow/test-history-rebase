import { createCRUDSelectors } from '@/ducks/utils/crudV2';

import { STATE_KEY } from './constants';

export const { root: rootNoteSelector, byID: noteByIDSelector } = createCRUDSelectors(STATE_KEY);
