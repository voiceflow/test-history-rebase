import { UserRole } from '@voiceflow/dtos';
import { RoleScopeType } from '@voiceflow/schema-types';

import { PERMISSIONS_CONFIG } from './permissions.config';
import { Membership, PermissionsByResourceID } from './permissions.types';
import { VirtualRole } from './roles.constants';

const getPermissionsByScopeAndRole = (scope: RoleScopeType, role: UserRole | VirtualRole) =>
  PERMISSIONS_CONFIG.filter(
    (permission) => !permission.scopes || (permission.scopes.includes(scope) && permission.roles.includes(role))
  )
    .map((permission) => permission.permission)
    .sort(); // it's easyer to visualize and compare the permissions if they are sorted

export const buildUserPermissionByResource = (roles: Membership[]) => {
  const membershipByScope = roles.reduce(
    (acc, membership) => {
      if (acc[membership.scope]) acc[membership.scope].push(membership);

      return acc;
    },
    {
      [RoleScopeType.ORGANIZATION]: [],
      [RoleScopeType.WORKSPACE]: [],
      [RoleScopeType.PROJECT]: [],
      [RoleScopeType.VERSION]: [],
    } as Record<RoleScopeType, Membership[]>
  );

  const permissionsByOrgID = Object.fromEntries(
    membershipByScope.organization.map((role) => [
      role.organizationID,
      {
        organizationID: role.organizationID,
        permissions: getPermissionsByScopeAndRole(RoleScopeType.ORGANIZATION, role.role),
      },
    ])
  );

  const permissionsByWorkspaceID = Object.fromEntries(
    membershipByScope.workspace.map((role) => [
      role.workspaceID,
      {
        workspaceID: role.workspaceID,
        organizationID: role.organizationID,
        permissions: getPermissionsByScopeAndRole(RoleScopeType.WORKSPACE, role.role),
      },
    ])
  );

  const permissionsByProjectID = Object.fromEntries(
    membershipByScope.project.map((role) => [
      role.assistantID,
      {
        projectID: role.assistantID,
        workspaceID: role.workspaceID,
        organizationID: role.organizationID,
        permissions: getPermissionsByScopeAndRole(RoleScopeType.PROJECT, role.role),
      },
    ])
  );

  return {
    organization: permissionsByOrgID,
    workspace: permissionsByWorkspaceID,
    project: permissionsByProjectID,
  } as PermissionsByResourceID;
};

// This method merges the permissions of the organization, workspace, and project in a single list.
export const getPermissionsList = (
  permissionsByResourceID: PermissionsByResourceID,
  options: { organizationID: string } | { workspaceID: string } | { assistantID: string; workspaceID: string }
) => {
  const assistantID = 'assistantID' in options ? options.assistantID : undefined;
  const projectResource = assistantID ? permissionsByResourceID.project[assistantID] : undefined;

  const workspaceID = 'workspaceID' in options ? options.workspaceID : projectResource?.workspaceID;
  const workspaceResource = workspaceID ? permissionsByResourceID.workspace[workspaceID] : null;

  const organizationID = 'organizationID' in options ? options.organizationID : workspaceResource?.organizationID;

  return new Set(
    [
      ...(organizationID ? permissionsByResourceID.organization[organizationID].permissions : []),
      ...(workspaceID ? permissionsByResourceID.workspace[workspaceID].permissions : []),
      ...(assistantID ? permissionsByResourceID.project[assistantID].permissions : []),
    ].sort()
  );
};
