import { UserRole } from '@voiceflow/dtos';
import { RoleScopeType } from '@voiceflow/schema-types';

import { User } from './User';

export interface OrganizationMember {
  user: User;
  membership: {
    role: UserRole;
    scope: RoleScopeType;
    organizationID: string;
    workspaceID?: string | null;
    projectID?: string | null;
  };
}
