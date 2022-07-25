import { createCRUDSelectors } from '@/ducks/utils/crudV2';

import { STATE_KEY } from './constants';

export const {
  all: allDomainsSelector,
  map: domainsMapSelector,
  byID: domainByIDSelector,
  byIDs: domainsByIDsSelector,
  allIDs: allDomainIDsSelector,
} = createCRUDSelectors(STATE_KEY);
