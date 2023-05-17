import { createCRUDSelectors } from '@/ducks/utils/crudV2';

import { STATE_KEY } from '../constants';

export const {
  all: allWorkspacesSelector,
  byID: workspaceByIDSelector,
  allIDs: allWorkspaceIDsSelector,
  isEmpty: workspacesEmptySelector,
  getByID: getWorkspaceByIDSelector,
} = createCRUDSelectors(STATE_KEY);
