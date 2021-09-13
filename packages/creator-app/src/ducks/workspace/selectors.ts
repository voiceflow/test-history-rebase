import * as CRUD from '@/ducks/utils/crud';

import { STATE_KEY } from './constants';

const workspaceSelectors = CRUD.createCRUDSelectors(STATE_KEY);

/**
 * @deprecated
 */
export const allWorkspacesSelector = workspaceSelectors.all;
/**
 * @deprecated
 */
export const allWorkspaceIDsSelector = workspaceSelectors.allIDs;
/**
 * @deprecated
 */
export const workspaceByIDSelector = workspaceSelectors.byID;
