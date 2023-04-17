import { Nullish } from '@voiceflow/common';
import { PlanType, UserRole } from '@voiceflow/internal';
import { useContextApi } from '@voiceflow/ui';
import React from 'react';

import { VirtualRole } from '@/constants/roles';
import * as Organization from '@/ducks/organization';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useSelector } from '@/hooks/redux';

export interface IdentityContextValue {
  activePlan: Nullish<PlanType>;
  activeRole: Nullish<UserRole | VirtualRole>;
  organizationRole: Nullish<UserRole | VirtualRole>;
  organizationTrialExpired: Nullish<boolean>;
}

/**
 * shouldn't be used directly, use `useIdentity` instead
 */
export const IdentityContext = React.createContext<IdentityContextValue>({
  activePlan: null,
  activeRole: null,
  organizationRole: null,
  organizationTrialExpired: null,
});

export const IdentityProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const activePlan = useSelector(WorkspaceV2.active.planSelector);
  const activeRole = useSelector(WorkspaceV2.active.userRoleSelector);
  const organizationID = useSelector(WorkspaceV2.active.organizationIDSelector);
  const organizationRole = useSelector(Organization.currentMemberRoleByIDSelector, { id: organizationID });
  const organizationTrialExpired = useSelector(WorkspaceV2.active.organizationTrialExpiredSelector);

  const api = useContextApi({
    activePlan,
    activeRole: organizationTrialExpired ? UserRole.VIEWER : activeRole,
    organizationRole,
    organizationTrialExpired,
  });

  return <IdentityContext.Provider value={api}>{children}</IdentityContext.Provider>;
};
