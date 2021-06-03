import { createCRUDSelectors } from '@/ducks/utils/crud';

import { STATE_KEY } from './constants';

export const {
  root: rootReportTagsSelector,
  map: mapReportTagsSelector,
  all: allReportTagsSelector,
  byID: reportTagByIDSelector,
  findByIDs: reportTagByIDsSelector,
  has: hasReportTagsSelector,
} = createCRUDSelectors(STATE_KEY);
