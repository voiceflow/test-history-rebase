import { createCRUDSelectors } from '@/ducks/utils/crud';

import { STATE_KEY } from './constants';

export const { map: mapReportTagsSelector, all: allReportTagsSelector, findByIDs: reportTagsByIDsSelector } = createCRUDSelectors(STATE_KEY);
