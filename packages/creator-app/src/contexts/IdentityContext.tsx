import { Nullish } from '@voiceflow/common';
import { PlanType, UserRole } from '@voiceflow/internal';
import { useContextApi } from '@voiceflow/ui';
import React from 'react';

import { VirtualRole } from '@/constants/roles';
import * as UI from '@/ducks/ui';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useSelector } from '@/hooks/redux';

export interface IdentityContextValue {
  activePlan: Nullish<PlanType>;
  activeRole: Nullish<UserRole | VirtualRole>;
  organizationTrialExpired: Nullish<boolean>;
}

export const IdentityContext = React.createContext<IdentityContextValue | null>(null);

export const IdentityProvider: React.OldFC = ({ children }) => {
  const activePlan = useSelector(WorkspaceV2.active.planSelector);
  const activeRole = useSelector(WorkspaceV2.active.userRoleSelector);
  const organizationTrialExpired = useSelector(WorkspaceV2.active.organizationTrialExpired);

  const isPreviewing = useSelector(UI.isPreviewingVersion);

  const api = useContextApi({ activePlan, activeRole: isPreviewing ? VirtualRole.PREVIEWER : activeRole, organizationTrialExpired });

  return <IdentityContext.Provider value={api}>{children}</IdentityContext.Provider>;
};
