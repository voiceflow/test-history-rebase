import { FullSpinner, FullSpinnerProps } from '@voiceflow/ui';
import React from 'react';
import { matchPath, useLocation } from 'react-router-dom';

import { LegacyPath, Path } from '@/config/routes';
import DashboardLoader from '@/pages/DashboardV2/components/DashboardLoader';
import ProjectLoader from '@/pages/Project/components/ProjectLoader';

const WorkspaceOrProjectLoader: React.FC<FullSpinnerProps> = (props) => {
  const location = useLocation();

  const isProject = React.useMemo(
    () =>
      matchPath(location.pathname, {
        path: [
          LegacyPath.PROJECT_CANVAS,
          Path.PROJECT_DOMAIN,
          Path.PROJECT_PROTOTYPE,
          Path.PROJECT_SETTINGS,
          Path.PROJECT_TOOLS,
          Path.PROJECT_PUBLISH,
          Path.PROJECT_ANALYTICS,
          Path.PROJECT_KNOWLEDGE_BASE,
          Path.PROJECT_CMS,
          Path.CONVERSATIONS,
        ],
      }),
    [location.pathname]
  );

  const isExport = React.useMemo(() => matchPath(location.pathname, { path: [Path.PROJECT_EXPORT] }), [location.pathname]);

  if (isExport) return <FullSpinner {...props} />;

  return isProject ? <ProjectLoader {...props} /> : <DashboardLoader {...props} />;
};

export default WorkspaceOrProjectLoader;
