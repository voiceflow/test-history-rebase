import { Nullish } from '@voiceflow/common';
import { UserRole } from '@voiceflow/internal';
import { useContextApi } from '@voiceflow/ui';
import React from 'react';

import { VirtualRole } from '@/constants/roles';
import * as ProjectV2 from '@/ducks/projectV2';
import { useSelector } from '@/hooks/redux';

import { useProjectPreview } from './ProjectPreviewContext';

export interface ProjectIdentityContextValue {
  activeRole: Nullish<UserRole | VirtualRole>;
}

/**
 * shouldn't be used directly, use `useIdentity` instead
 */
export const ProjectIdentityContext = React.createContext<ProjectIdentityContextValue | null>(null);

export interface ProjectIdentityProviderProps extends React.PropsWithChildren, Partial<ProjectIdentityContextValue> {}

/**
 * Can be use on the dashboard page to provide the project identity context for the project item
 */
export const ProjectIdentityProvider: React.FC<ProjectIdentityProviderProps> = ({ children, activeRole: activeRoleProp }) => {
  const activeRole = useSelector(ProjectV2.active.userRoleSelector);
  const isPreview = useProjectPreview();

  const api = useContextApi({ activeRole: isPreview ? VirtualRole.PREVIEWER : activeRoleProp ?? activeRole });

  return <ProjectIdentityContext.Provider value={api}>{children}</ProjectIdentityContext.Provider>;
};
