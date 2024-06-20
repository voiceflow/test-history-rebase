import { type ITabLoader, TabLoader } from '@voiceflow/ui-next';
import React from 'react';
import { matchPath, useLocation } from 'react-router-dom';

import { Path } from '@/config/routes';
import { Permission } from '@/constants/permissions';
import { usePermission } from '@/hooks';
import { AssistantLoader } from '@/pages/AssistantCMS/components/AssistantLoader.component';
import DashboardLoader from '@/pages/DashboardV2/components/DashboardLoader';
import { DiagramLayout } from '@/pages/Project/components/Diagram/DiagramLayout/DiagramLayout.component';
import { DiagramLoader } from '@/pages/Project/components/Diagram/DiagramLoader.component';

const WorkspaceOrProjectLoader: React.FC<ITabLoader> = (props) => {
  const location = useLocation();
  const [canEditProject] = usePermission(Permission.PROJECT_UPDATE);

  const [isExport, isCMS, isCanvas, isProject] = React.useMemo(
    () => [
      !!matchPath(location.pathname, Path.PROJECT_EXPORT),
      !!matchPath(location.pathname, Path.PROJECT_CMS),
      !!matchPath(location.pathname, [Path.PROJECT_CANVAS, Path.PROJECT_PROTOTYPE]),
      !!matchPath(location.pathname, [
        Path.PROJECT_CMS,
        Path.PROJECT_CANVAS,
        Path.PROJECT_PUBLISH,
        Path.PROJECT_SETTINGS,
        Path.PROJECT_PROTOTYPE,
        Path.PROJECT_ANALYTICS,
        Path.PROJECT_CONVERSATIONS,
      ]),
    ],
    [location.pathname]
  );

  if (isExport) {
    return <TabLoader variant="dark" {...props} />;
  }

  if (isCanvas) {
    return (
      <DiagramLayout>
        <DiagramLoader variant="dark" {...props} />
      </DiagramLayout>
    );
  }

  return isProject ? <AssistantLoader isCMS={canEditProject && isCMS} /> : <DashboardLoader {...props} />;
};

export default WorkspaceOrProjectLoader;
