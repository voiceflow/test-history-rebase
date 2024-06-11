import { Nullable } from '@voiceflow/common';
import { UserRole } from '@voiceflow/dtos';
import { PlanType } from '@voiceflow/internal';
import { useContextApi } from '@voiceflow/ui';
import React from 'react';

import { VirtualRole } from '@/constants/roles';
import * as Account from '@/ducks/account';
import * as Organization from '@/ducks/organization';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useSelector } from '@/hooks/redux';

export interface PermissionContextValue {
  activeRole: Nullable<UserRole | VirtualRole>;
  workspacePlan: Nullable<PlanType>;
  organizationRole: Nullable<UserRole>;
  organizationTrialExpired: Nullable<boolean>;
}

/**
 * shouldn't be used directly, use `useIdentity` instead
 */
export const PermissionContext = React.createContext<PermissionContextValue>({
  activeRole: null,
  workspacePlan: null,
  organizationRole: null,
  organizationTrialExpired: null,
});

export const PermissionProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const roles = useSelector(Account.userRolesSelector);
  const workspacePlan = useSelector(WorkspaceV2.active.planSelector);
  const workspaceRole = useSelector(WorkspaceV2.active.members.userRoleSelector);
  const organizationID = useSelector(WorkspaceV2.active.organizationIDSelector);
  const organizationRole = useSelector(Organization.currentMemberRoleByIDSelector, { id: organizationID });
  const organizationTrialExpired = useSelector(WorkspaceV2.active.organizationTrialExpiredSelector);

  const activeRole = organizationTrialExpired ? UserRole.VIEWER : workspaceRole;

  const api = useContextApi({
    activeRole:
      organizationRole === UserRole.ADMIN && activeRole === UserRole.ADMIN
        ? VirtualRole.ORGANIZATION_ADMIN
        : activeRole,
    workspacePlan,
    organizationRole,
    organizationTrialExpired,
  });

  return <PermissionContext.Provider value={api}>{children}</PermissionContext.Provider>;
};
