import { Nullable } from '@voiceflow/common';
import { PlanName, UserRole } from '@voiceflow/dtos';
import { RoleScopeType } from '@voiceflow/schema-types';
import { useContextApi } from '@voiceflow/ui';
import React from 'react';

import { VirtualRole } from '@/constants/roles';
import * as Account from '@/ducks/account';
import * as Organization from '@/ducks/organization';
import * as Session from '@/ducks/session';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useSelector } from '@/hooks/redux';
import { Membership } from '@/permissions/permissions.types';

export interface IdentityV2ContextValue {
  activeRole: Nullable<UserRole | VirtualRole>;
  organizationPlan: Nullable<PlanName>;
  organizationRole: Nullable<UserRole>;
  organizationTrialExpired: Nullable<boolean>;
  roles: Membership[];
}

/**
 * shouldn't be used directly, use `useIdentity` instead
 */
export const IdentityV2Context = React.createContext<IdentityV2ContextValue>({
  activeRole: null,
  organizationPlan: null,
  organizationRole: null,
  organizationTrialExpired: null,
  roles: [],
});

export const IdentityV2Provider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const roles = useSelector(Account.userRolesSelector);
  const organizationID = useSelector(Session.activeOrganizationIDSelector);
  const getOrganizationByID = useSelector(Organization.getOrganizationByIDSelector);
  const organizationTrialExpired = useSelector(WorkspaceV2.active.organizationTrialExpiredSelector);

  const organization = React.useMemo(
    () => (organizationID ? getOrganizationByID(organizationID) : null),
    [getOrganizationByID, organizationID]
  );

  const activeRole = organizationTrialExpired ? UserRole.VIEWER : workspaceRole;

  const organizationRole = React.useMemo(
    () =>
      roles.find((role) => role.organizationID === organizationID && role.scope === RoleScopeType.ORGANIZATION)?.role ??
      null,
    [roles, organizationID]
  );

  const api = useContextApi({
    roles,
    activeRole:
      organizationRole === UserRole.ADMIN && activeRole === UserRole.ADMIN
        ? VirtualRole.ORGANIZATION_ADMIN
        : activeRole,
    organizationPlan,
    organizationRole,
    organizationTrialExpired,
  });

  return <IdentityV2Context.Provider value={api}>{children}</IdentityV2Context.Provider>;
};
