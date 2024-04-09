import { FeatureFlag } from '@voiceflow/realtime-sdk';
import { type ITabLoader, TabLoader } from '@voiceflow/ui-next';
import React from 'react';
import { matchPath, useLocation } from 'react-router-dom';

import { Path } from '@/config/routes';
import { useFeature } from '@/hooks/feature';
import DashboardLoader from '@/pages/DashboardV2/components/DashboardLoader';
import ProjectLoader from '@/pages/Project/components/ProjectLoader';

const WorkspaceOrProjectLoader: React.FC<ITabLoader> = (props) => {
  const location = useLocation();
  const cmsWorkflows = useFeature(FeatureFlag.CMS_WORKFLOWS);

  const [isProject, isCanvas] = React.useMemo(
    () => [
      matchPath(location.pathname, {
        path: [
          Path.PROJECT_CMS,
          Path.PROJECT_CANVAS,
          Path.PROJECT_DOMAIN,
          Path.PROJECT_PUBLISH,
          Path.PROJECT_SETTINGS,
          Path.PROJECT_PROTOTYPE,
          Path.PROJECT_ANALYTICS,
          Path.PROJECT_CONVERSATIONS,
        ],
      }),
      matchPath(location.pathname, {
        path: [Path.PROJECT_CANVAS, Path.PROJECT_PROTOTYPE],
      }),
    ],
    [location.pathname]
  );

  const isExport = React.useMemo(() => matchPath(location.pathname, { path: [Path.PROJECT_EXPORT] }), [location.pathname]);

  if (isExport) return <TabLoader variant="dark" {...props} />;
  if (cmsWorkflows.isEnabled && isCanvas) return <TabLoader variant="dark" {...props} />;

  return isProject ? <ProjectLoader {...props} /> : <DashboardLoader {...props} />;
};

export default WorkspaceOrProjectLoader;
