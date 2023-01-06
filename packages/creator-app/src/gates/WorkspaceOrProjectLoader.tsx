import * as Realtime from '@voiceflow/realtime-sdk';
import { FullSpinner, FullSpinnerProps } from '@voiceflow/ui';
import React from 'react';
import { matchPath, useLocation } from 'react-router-dom';

import { LegacyPath, Path } from '@/config/routes';
import { useFeature } from '@/hooks/feature';
import DashboardLoader from '@/pages/DashboardV2/components/DashboardLoader';
import ProjectLoader from '@/pages/Project/components/ProjectLoader';

const WorkspaceOrProjectLoader: React.OldFC<FullSpinnerProps> = (props) => {
  const location = useLocation();
  const dashboardV2 = useFeature(Realtime.FeatureFlag.DASHBOARD_V2);

  const isProject = React.useMemo(
    () =>
      matchPath(location.pathname, {
        path: [
          LegacyPath.PROJECT_CANVAS,
          Path.PROJECT_DOMAIN,
          Path.PROJECT_PROTOTYPE,
          Path.PROJECT_SETTINGS,
          Path.PROJECT_TOOLS,
          Path.PROJECT_MIGRATE,
          Path.PROJECT_PUBLISH,
          Path.CONVERSATIONS,
          Path.NLU_MANAGER,
        ],
      }),
    [location.pathname]
  );

  const isExport = React.useMemo(() => matchPath(location.pathname, { path: [Path.PROJECT_EXPORT] }), [location.pathname]);

  if (isExport || (!isProject && !dashboardV2.isEnabled)) return <FullSpinner {...props} />;

  return isProject ? <ProjectLoader {...props} /> : <DashboardLoader {...props} />;
};

export default WorkspaceOrProjectLoader;
