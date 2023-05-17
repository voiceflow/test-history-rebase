import { Nullable } from '@voiceflow/common';
import { UserRole } from '@voiceflow/internal';
import { useContextApi } from '@voiceflow/ui';
import dayjs from 'dayjs';
import React from 'react';

import { VirtualRole } from '@/constants/roles';
import { IdentityContext } from '@/contexts/IdentityContext';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Session from '@/ducks/session';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useSelector } from '@/hooks/redux';

import { useProjectPreview } from './ProjectPreviewContext';

export interface ProjectIdentityContextValue {
  projectID: Nullable<string>;
  activeRole: Nullable<UserRole | VirtualRole>;
  projectRole: Nullable<UserRole>;
}

/**
 * shouldn't be used directly, use `useIdentity` instead
 */
export const ProjectIdentityContext = React.createContext<ProjectIdentityContextValue | null>(null);

export interface ProjectIdentityProviderProps extends React.PropsWithChildren, Omit<ProjectIdentityContextValue, 'activeRole'> {}

/**
 * Can be use on the dashboard page to provide the project identity context for the project item
 */
export const ProjectIdentityProvider: React.FC<ProjectIdentityProviderProps> = ({ children, projectID, projectRole }) => {
  const identity = React.useContext(IdentityContext);
  const isPreview = useProjectPreview();

  const projects = useSelector(ProjectV2.allProjectsSelector);
  const projectsLimit = useSelector(WorkspaceV2.active.projectsLimitSelector);
  const workspaceLocked = useSelector(WorkspaceV2.active.isLockedSelector);

  const locked = React.useMemo(() => {
    if (identity.organizationTrialExpired) return true;
    if (!workspaceLocked) return false;

    const orderedProjects = projects.sort((a, b) => {
      if (a.updatedAt && !b.updatedAt) return -1;
      if (b.updatedAt && !a.updatedAt) return 1;

      return dayjs(a.updatedAt).isAfter(b.updatedAt) ? -1 : 1;
    });

    return orderedProjects.findIndex((project) => project.id === projectID) >= projectsLimit;
  }, [projects, projectID, identity.organizationTrialExpired, projectsLimit, workspaceLocked]);

  const activeRole = locked ? VirtualRole.LOCKED_PROJECT_VIEWER : projectRole;

  const api = useContextApi({
    projectID,
    activeRole: isPreview ? VirtualRole.PREVIEWER : activeRole,
    projectRole,
  });

  return <ProjectIdentityContext.Provider value={api}>{children}</ProjectIdentityContext.Provider>;
};

export const ActiveProjectIdentityProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const projectID = useSelector(Session.activeProjectIDSelector);
  const activeRole = useSelector(ProjectV2.active.userRoleSelector);

  return (
    <ProjectIdentityProvider projectID={projectID} projectRole={activeRole}>
      {children}
    </ProjectIdentityProvider>
  );
};
