import { createCRUDSelectors } from '@/ducks/utils/crudV2';

import { STATE_KEY } from './billing-plan.state';

export const { all: allPlansSelector, byID, allIDs, getByID } = createCRUDSelectors(STATE_KEY);
