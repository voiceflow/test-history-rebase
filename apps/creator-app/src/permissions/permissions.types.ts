import { UserRole } from '@voiceflow/dtos';
import { RoleScopeType } from '@voiceflow/schema-types';

import { Permission } from './permissions.constant';
import { VirtualRole } from './roles.constants';

export interface Membership {
  organizationID: string;
  workspaceID?: string;
  assistantID?: string;
  scope: RoleScopeType;
  role: UserRole;
}

export interface BaseRolePermission {
  roles: ReadonlyArray<UserRole | VirtualRole>;
  permission: Permission;
  // if permission is scoped to a specific scope
  scopes?: ReadonlyArray<RoleScopeType>;
}

export interface PermissionsByResourceID {
  organization: Record<
    string,
    {
      organizationID: string;
      permissions: Permission[];
    }
  >;
  workspace: Record<
    string,
    {
      workspaceID: string;
      organizationID: string;
      permissions: Permission[];
    }
  >;
  project: Record<
    string,
    {
      projectID: string;
      workspaceID: string;
      organizationID: string;
      permissions: Permission[];
    }
  >;
}
