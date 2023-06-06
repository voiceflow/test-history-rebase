import React from 'react';
import { useDispatch } from 'react-redux';
import { matchPath } from 'react-router-dom';

import { Path } from '@/config/routes';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import * as Version from '@/ducks/versionV2';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useSelector } from '@/hooks';
import RedirectWithSearch from '@/Routes/RedirectWithSearch';

const DiagramGate: React.FC<React.PropsWithChildren> = ({ children }) => {
  const dispatch = useDispatch();
  const version = useSelector(Version.active.versionSelector);
  const hasActiveDiagram = useSelector(Session.hasActiveDiagramSelector);
  const organizationTrialExpired = useSelector(WorkspaceV2.active.organizationTrialExpiredSelector);

  React.useEffect(() => {
    if (!version) return;

    const { pathname } = window.location;
    const { id: versionID, rootDiagramID } = version;

    const canvasMatch = matchPath<{ diagramID?: string }>(pathname, { path: Path.PROJECT_CANVAS });

    const diagramID = canvasMatch?.params.diagramID ?? rootDiagramID;

    if (canvasMatch && !canvasMatch.params.diagramID) {
      dispatch(Router.redirectToCanvas({ diagramID, versionID }));
    }

    dispatch(Session.setActiveDiagramID(diagramID));
  }, []);

  if (!version || organizationTrialExpired) return <RedirectWithSearch to={Path.DASHBOARD} />;

  if (!hasActiveDiagram) return null;

  return <>{children}</>;
};

export default DiagramGate;
