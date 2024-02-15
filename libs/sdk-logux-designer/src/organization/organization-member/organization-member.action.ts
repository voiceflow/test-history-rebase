import { createCRUD } from '@/crud/crud.action';

import { organizationType } from '../organization.constants';
import type { OrganizationAction } from '../organization.types';

export const organizationMemberAction = createCRUD(organizationType('member'));

/**
 * user-sent events
 */

/* DeleteOne */

export interface DeleteOne extends OrganizationAction {
  id: number;
}

export const DeleteOne = organizationMemberAction.crud.deleteOne<DeleteOne>();
