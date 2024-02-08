import { createCRUDSelectors } from '@/ducks/utils/crudV2';

import { STATE_KEY } from '../organization.constants';

export const {
  all: allOrganizationsSelector,
  byID: organizationByIDSelector,
  allIDs: allOrganizationIDsSelector,
  getByID: getOrganizationByIDSelector,
} = createCRUDSelectors(STATE_KEY);
