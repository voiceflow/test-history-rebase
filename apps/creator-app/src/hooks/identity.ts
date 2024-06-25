import type { Nullable } from '@voiceflow/common';
import { UserRole } from '@voiceflow/dtos';
import { PlanType } from '@voiceflow/internal';
import React from 'react';

import type { VirtualRole } from '@/constants/roles';
import type { IdentityContextValue } from '@/contexts/IdentityContext';
import { IdentityContext } from '@/contexts/IdentityContext';
import type { ProjectIdentityContextValue } from '@/pages/Project/contexts/ProjectIdentityContext';
import { ProjectIdentityContext } from '@/pages/Project/contexts/ProjectIdentityContext';
import { isRoleAStrongerRoleB } from '@/utils/role';

export interface Identity extends IdentityContextValue, ProjectIdentityContextValue {
  activeRole: VirtualRole | UserRole;
  activePlan: PlanType;
  projectActiveRole: Nullable<VirtualRole | UserRole>;
  workspaceActiveRole: Nullable<VirtualRole | UserRole>;
}

export const useCreateIdentity = () => {
  const identity = React.useContext(IdentityContext);

  return React.useCallback(
    (projectIdentity: ProjectIdentityContextValue | null): Identity => {
      const localIdentity: Identity = {
        ...identity,
        projectID: projectIdentity?.projectID ?? null,
        activeRole: identity.activeRole ?? UserRole.VIEWER,
        activePlan: identity.workspacePlan ?? PlanType.STARTER,
        projectRole: projectIdentity?.projectRole ?? null,
        projectActiveRole: projectIdentity?.activeRole ?? null,
        workspaceActiveRole: identity.activeRole,
      };

      if (!projectIdentity?.activeRole) return localIdentity;

      if (!identity.activeRole || isRoleAStrongerRoleB(projectIdentity.activeRole, identity.activeRole)) {
        localIdentity.activeRole = projectIdentity.activeRole;
      }

      return localIdentity;
    },
    [identity]
  );
};

export const useIdentity = (): Identity => {
  const projectIdentity = React.useContext(ProjectIdentityContext);

  const createIdentity = useCreateIdentity();

  return React.useMemo(() => createIdentity(projectIdentity), [createIdentity, projectIdentity]);
};
