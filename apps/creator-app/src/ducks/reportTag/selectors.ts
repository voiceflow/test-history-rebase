import { createSelector } from 'reselect';

import { createCRUDSelectors } from '@/ducks/utils/crudV2';

import { STATE_KEY } from './constants';

export const {
  map: mapReportTagsSelector,
  all: allReportTagsSelector,
  byIDs: reportTagsByIDsSelector,
} = createCRUDSelectors(STATE_KEY);

export const reportTagsLabelsByIDsSelector = createSelector([reportTagsByIDsSelector], (reportTags) =>
  reportTags.map((reportTag) => reportTag.label)
);
