import React from 'react';
import { batch, useDispatch } from 'react-redux';
import { matchPath } from 'react-router-dom';

import { Path } from '@/config/routes';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import * as Version from '@/ducks/versionV2';
import { useSelector } from '@/hooks';
import RedirectWithSearch from '@/Routes/RedirectWithSearch';

const DiagramGate: React.FC = ({ children }) => {
  const dispatch = useDispatch();
  const version = useSelector(Version.active.versionSelector);
  const hasActiveDiagram = useSelector(Session.hasActiveDiagramSelector);

  React.useEffect(() => {
    if (!version) return;

    const canvasRoute = matchPath<{ diagramID?: string }>(window.location.pathname, { path: Path.PROJECT_CANVAS });
    const diagramID = canvasRoute?.params.diagramID ?? version.rootDiagramID;

    batch(() => {
      if (canvasRoute && !canvasRoute.params.diagramID) {
        dispatch(Router.redirectToCanvas(version.id, diagramID));
      }

      dispatch(Session.setActiveDiagramID(diagramID));
    });
  }, []);

  if (!version) return <RedirectWithSearch to={Path.DASHBOARD} />;

  if (!hasActiveDiagram) return null;

  return <>{children}</>;
};

export default DiagramGate;
