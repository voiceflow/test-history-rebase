import React from 'react';
import { batch, useDispatch } from 'react-redux';
import { generatePath, matchPath } from 'react-router-dom';

import { LegacyPath, Path } from '@/config/routes';
import * as Domain from '@/ducks/domain';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import * as Version from '@/ducks/versionV2';
import { useSelector } from '@/hooks';
import RedirectWithSearch from '@/Routes/RedirectWithSearch';

const DiagramGate: React.FC = ({ children }) => {
  const dispatch = useDispatch();
  const version = useSelector(Version.active.versionSelector);
  const rootDomainID = useSelector(Domain.rootDomainIDSelector);
  const hasActiveDomain = useSelector(Session.hasActiveDomainSelector);
  const hasActiveDiagram = useSelector(Session.hasActiveDiagramSelector);
  const getDomainIDByTopicID = useSelector(Domain.getDomainIDByTopicIDSelector);

  React.useEffect(() => {
    if (!version || !rootDomainID) return;

    const { pathname } = window.location;
    const { id: versionID, rootDiagramID } = version;

    const domainMatch = matchPath<{ domainID: string }>(pathname, { path: Path.PROJECT_DOMAIN });
    const canvasMatch = matchPath<{ domainID: string; diagramID?: string }>(pathname, { path: Path.DOMAIN_CANVAS });
    const legacyCanvasMatch = matchPath<{ diagramID?: string }>(pathname, { path: LegacyPath.PROJECT_CANVAS });

    batch(() => {
      const diagramID = canvasMatch?.params.diagramID ?? legacyCanvasMatch?.params.diagramID ?? rootDiagramID;
      const domainID = canvasMatch?.params.domainID ?? getDomainIDByTopicID({ topicID: diagramID }) ?? rootDomainID;

      if (domainMatch && !domainMatch.params.domainID) {
        dispatch(Router.redirectToCanvas({ domainID, diagramID, versionID }));
      } else if (canvasMatch && !canvasMatch.params.diagramID) {
        dispatch(Router.redirectToCanvas({ domainID, diagramID, versionID }));
      } else if (legacyCanvasMatch) {
        const matchedPath = generatePath(LegacyPath.PROJECT_CANVAS, legacyCanvasMatch.params);

        dispatch(Router.redirectToCanvas({ domainID, diagramID, versionID, extraPath: pathname.replace(matchedPath, '') }));
        dispatch(Session.setActiveDomainID(domainID));
      }

      dispatch(Session.setActiveDomainID(domainID));
      dispatch(Session.setActiveDiagramID(diagramID));
    });
  }, []);

  if (!version || !rootDomainID) return <RedirectWithSearch to={Path.DASHBOARD} />;

  if (!hasActiveDiagram || !hasActiveDomain) return null;

  return <>{children}</>;
};

export default DiagramGate;
