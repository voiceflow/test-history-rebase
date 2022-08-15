import * as CRUD from '@/ducks/utils/crud';

import { STATE_KEY } from './constants';

// selectors

export const { root: rootThreadsSelector, all: allThreadsSelector, byID: threadByIDSelector } = CRUD.createCRUDSelectors(STATE_KEY);
