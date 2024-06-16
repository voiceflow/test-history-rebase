import { Utils } from '@voiceflow/common';
import React from 'react';
import { flushSync } from 'react-dom';
import { useDispatch } from 'react-redux';

import { Path } from '@/config/routes';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import * as Version from '@/ducks/versionV2';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useActiveProjectPlatformConfig, useSelector } from '@/hooks';
import RedirectWithSearch from '@/Routes/RedirectWithSearch';
import { matchPath } from '@/utils/route.util';

const DiagramGate: React.FC<React.PropsWithChildren> = ({ children }) => {
  const dispatch = useDispatch();

  const version = useSelector(Version.active.versionSelector);

  const hasActiveDiagram = useSelector(Session.hasActiveDiagramSelector);
  const organizationTrialExpired = useSelector(WorkspaceV2.active.organizationTrialExpiredSelector);
  const isEnterprise = useSelector(WorkspaceV2.active.isEnterpriseSelector);

  const platformConfig = useActiveProjectPlatformConfig();

  React.useEffect(() => {
    if (!version) return Utils.functional.noop;

    const { pathname } = window.location;
    const { id: versionID, rootDiagramID } = version;

    const projectCanvasMatch = matchPath(pathname, Path.PROJECT_CANVAS);

    const diagramID = projectCanvasMatch?.params.diagramID ?? rootDiagramID;

    // we need this hack to make sure that url is updated before we render children
    // otherwise we will get an old url in the diagram/domain sync components
    const frame = requestAnimationFrame(() => {
      flushSync(() => {
        if (projectCanvasMatch && !projectCanvasMatch.params.diagramID) {
          dispatch(Router.redirectToProjectCanvas({ versionID, diagramID }));
        }
      });

      dispatch(Session.setActiveDiagramID(diagramID));
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  const isProTrialExpired = organizationTrialExpired && !isEnterprise;

  if (!version || platformConfig.isDeprecated || isProTrialExpired) return <RedirectWithSearch to={Path.DASHBOARD} />;

  if (!hasActiveDiagram) return null;

  return <>{children}</>;
};

export default DiagramGate;
