import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { IdentityContext, IdentityContextValue } from '@/contexts/IdentityContext';
import { ProjectIdentityContext } from '@/pages/Project/contexts/ProjectIdentityContext';
import { isVirtualRole } from '@/utils/role';

export interface Identity extends IdentityContextValue {}

export interface IdentityOptions {
  workspaceLevelOnly?: boolean;
}

export const useIdentity = ({ workspaceLevelOnly = false }: IdentityOptions = {}): Identity => {
  const identity = React.useContext(IdentityContext);
  const projectIdentity = React.useContext(ProjectIdentityContext);

  return React.useMemo(() => {
    if (workspaceLevelOnly || !projectIdentity?.activeRole) return identity;

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
  }, [identity, projectIdentity, workspaceLevelOnly]);
};
