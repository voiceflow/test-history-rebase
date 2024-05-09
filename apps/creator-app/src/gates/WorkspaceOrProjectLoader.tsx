import { FeatureFlag } from '@voiceflow/realtime-sdk';
import { type ITabLoader, TabLoader } from '@voiceflow/ui-next';
import React from 'react';
import { matchPath, useLocation } from 'react-router-dom';

import { Path } from '@/config/routes';
import { useFeature } from '@/hooks/feature';
import { AssistantLoader } from '@/pages/AssistantCMS/components/AssistantLoader.component';
import DashboardLoader from '@/pages/DashboardV2/components/DashboardLoader';
import { DiagramLoader } from '@/pages/Project/components/Diagram/DiagramLoader.component';
import ProjectLoader from '@/pages/Project/components/ProjectLoader';

const WorkspaceOrProjectLoader: React.FC<ITabLoader> = (props) => {
  const location = useLocation();
  const cmsWorkflows = useFeature(FeatureFlag.CMS_WORKFLOWS);

  const [isExport, isCMS, isCanvas, isProject] = React.useMemo(
    () => [
      !!matchPath(location.pathname, Path.PROJECT_EXPORT),
      !!matchPath(location.pathname, [Path.PROJECT_CMS]),
      !!matchPath(location.pathname, [Path.PROJECT_CANVAS, Path.PROJECT_PROTOTYPE]),
      !!matchPath(location.pathname, [
        Path.PROJECT_CMS,
        Path.PROJECT_CANVAS,
        Path.PROJECT_DOMAIN,
        Path.PROJECT_PUBLISH,
        Path.PROJECT_SETTINGS,
        Path.PROJECT_PROTOTYPE,
        Path.PROJECT_ANALYTICS,
        Path.PROJECT_CONVERSATIONS,
      ]),
    ],
    [location.pathname]
  );

  if (isExport) return <TabLoader variant="dark" {...props} />;

  if (cmsWorkflows.isEnabled) {
    if (isCanvas) return <DiagramLoader variant="dark" {...props} />;

    return isProject ? <AssistantLoader isCMS={isCMS} /> : <DashboardLoader {...props} />;
  }

  return isProject ? <ProjectLoader {...props} /> : <DashboardLoader {...props} />;
};

export default WorkspaceOrProjectLoader;
