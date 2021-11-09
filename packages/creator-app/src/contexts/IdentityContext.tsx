import { Nullish } from '@voiceflow/common';
import { PlanType, UserRole } from '@voiceflow/internal';
import { useContextApi } from '@voiceflow/ui';
import React from 'react';

import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useSelector } from '@/hooks/redux';

export interface IdentityContextValue {
  activePlan: Nullish<PlanType>;
  activeRole: Nullish<UserRole>;
}

export const IdentityContext = React.createContext<IdentityContextValue | null>(null);

export const IdentityProvider: React.FC = ({ children }) => {
  const activePlan = useSelector(WorkspaceV2.active.planSelector);
  const activeRole = useSelector(WorkspaceV2.active.userRoleSelector);

  const api = useContextApi({ activePlan, activeRole });

  return <IdentityContext.Provider value={api}>{children}</IdentityContext.Provider>;
};
