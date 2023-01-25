import { Nullish } from '@voiceflow/common';
import { PlanType, UserRole } from '@voiceflow/internal';
import { useContextApi } from '@voiceflow/ui';
import React from 'react';

import { VirtualRole } from '@/constants/roles';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useSelector } from '@/hooks/redux';

export interface IdentityContextValue {
  activePlan: Nullish<PlanType>;
  activeRole: Nullish<UserRole | VirtualRole>;
  organizationTrialExpired: Nullish<boolean>;
}

/**
 * shouldn't be used directly, use `useIdentity` instead
 */
export const IdentityContext = React.createContext<IdentityContextValue>({
  activePlan: null,
  activeRole: null,
  organizationTrialExpired: null,
});

export const IdentityProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const activePlan = useSelector(WorkspaceV2.active.planSelector);
  const activeRole = useSelector(WorkspaceV2.active.userRoleSelector);
  const organizationTrialExpired = useSelector(WorkspaceV2.active.organizationTrialExpired);

  const api = useContextApi({ activePlan, activeRole, organizationTrialExpired });

  return <IdentityContext.Provider value={api}>{children}</IdentityContext.Provider>;
};
