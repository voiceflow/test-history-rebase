import { UserRole } from '@voiceflow/internal';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { VirtualRole } from '@/constants/roles';
import { IdentityContext, IdentityContextValue } from '@/contexts/IdentityContext';
import { ProjectIdentityContext, ProjectIdentityContextValue } from '@/pages/Project/contexts/ProjectIdentityContext';
import { isVirtualRole } from '@/utils/role';

export interface Identity extends IdentityContextValue {}

export interface IdentityOptions {
  /**
   * if true, then the project identity will be ignored
   */
  workspaceOnly?: boolean;

  /**
   * if true, then the organization member (if admin) will be treated as an workspace admin
   */
  organizationAdmin?: boolean;
}

export const useCreateIdentity = ({ workspaceOnly = false, organizationAdmin = false }: IdentityOptions = {}) => {
  const identity = React.useContext(IdentityContext);

  return React.useCallback(
    (projectIdentity: ProjectIdentityContextValue | null) => {
      if (organizationAdmin && identity.organizationRole === UserRole.ADMIN) return { ...identity, activeRole: VirtualRole.ORGANIZATION_ADMIN };

      if (workspaceOnly || !projectIdentity?.activeRole) return identity;

      // if there is no identity role, then use the project role
      // if the identity role is a virtual role, then use the project role
      // if the project role is a virtual role, then use the project role
      // if the project role is a strengthener role, then use the project role
      if (
        !identity.activeRole ||
        isVirtualRole(identity.activeRole) ||
        isVirtualRole(projectIdentity.activeRole) ||
        Realtime.Utils.role.isRoleAStrongerRoleB(projectIdentity.activeRole, identity.activeRole)
      ) {
        return {
          ...identity,
          activeRole: projectIdentity.activeRole,
        };
      }

      return identity;
    },
    [identity, workspaceOnly]
  );
};

export const useIdentity = (options?: IdentityOptions): Identity => {
  const projectIdentity = React.useContext(ProjectIdentityContext);

  const createIdentity = useCreateIdentity(options);

  return React.useMemo(() => createIdentity(projectIdentity), [createIdentity, projectIdentity]);
};
