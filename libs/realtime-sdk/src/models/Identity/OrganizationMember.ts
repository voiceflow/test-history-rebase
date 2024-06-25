import type { UserRole } from '@voiceflow/dtos';
import type { RoleScopeType } from '@voiceflow/schema-types';

import type { User } from './User';

export interface OrganizationMember {
  user: User;
  membership: {
    role: UserRole;
    organizationID: string;
    workspaceID?: string | null;
    projectID?: string | null;
    scope?: RoleScopeType;
  };
}
