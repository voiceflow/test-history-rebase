import { useContextApi } from '@voiceflow/ui';
import React from 'react';

import { FeatureFlag } from '@/config/features';
import * as Session from '@/ducks/session';
import * as Workspace from '@/ducks/workspace';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useFeature } from '@/hooks/feature';
import { useSelector } from '@/hooks/redux';
import { useWorkspaceUserRoleSelector } from '@/hooks/workspace';

export interface IdentityContextValue {
  activePlan: ReturnType<typeof Workspace.planTypeSelector>;
  activeRole: ReturnType<typeof useWorkspaceUserRoleSelector>;
}

export const IdentityContext = React.createContext<IdentityContextValue | null>(null);

export const IdentityProvider: React.FC = ({ children }) => {
  const atomicActions = useFeature(FeatureFlag.ATOMIC_ACTIONS);

  const activeWorkspaceID = useSelector(Session.activeWorkspaceIDSelector);

  const activePlanV1 = useSelector(Workspace.planTypeSelector);
  const activePlanRealtime = useSelector((state) => WorkspaceV2.workspacePlanTypeByIDSelector(state, { id: activeWorkspaceID }));
  const activeRole = useWorkspaceUserRoleSelector();
  const activePlan = atomicActions.isEnabled ? activePlanRealtime : activePlanV1;

  const api = useContextApi({ activePlan, activeRole });

  return <IdentityContext.Provider value={api}>{children}</IdentityContext.Provider>;
};
