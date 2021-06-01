import { createCRUDSelectors } from '@/ducks/utils/crud';

import { STATE_KEY } from './constants';

export const {
  root: rootTranscriptsSelector,
  map: mapTranscriptsSelector,
  all: allTranscriptsSelector,
  byID: transcriptByIDSelector,
  findByIDs: transcriptsByIDsSelector,
  has: hasTranscriptsSelector,
} = createCRUDSelectors(STATE_KEY);
