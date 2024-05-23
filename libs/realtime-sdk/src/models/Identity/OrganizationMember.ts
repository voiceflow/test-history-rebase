import { UserRole } from '@voiceflow/internal';
import { RoleScopeType } from '@voiceflow/schema-types';

import { User } from './User';

export interface OrganizationMember {
  user: Omit<User, 'createdAt' | 'updatedAt'>;
  membership: {
    role: UserRole;
    scope: RoleScopeType;
    organizationID: string;
    assistantID: string | null;
    workspaceID: string | null;
  };
}
