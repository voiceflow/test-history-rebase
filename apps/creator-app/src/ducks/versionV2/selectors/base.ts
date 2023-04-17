import { createCRUDSelectors } from '@/ducks/utils/crudV2';

import { STATE_KEY } from '../constants';

export const { byID: versionByIDSelector, getByID: getVersionByIDSelector } = createCRUDSelectors(STATE_KEY);
