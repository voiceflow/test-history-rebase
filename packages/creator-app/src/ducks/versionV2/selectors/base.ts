import { createCurriedSelector } from '@/ducks/utils';
import { createCRUDSelectors } from '@/ducks/utils/crudV2';

import { STATE_KEY } from '../constants';

export const { byID: versionByIDSelector } = createCRUDSelectors(STATE_KEY);

export const getVersionByIDSelector = createCurriedSelector(versionByIDSelector);
