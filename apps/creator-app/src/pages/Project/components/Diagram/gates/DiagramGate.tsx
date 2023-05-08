import { Utils } from '@voiceflow/common';
import React from 'react';
import { flushSync } from 'react-dom';
import { useDispatch } from 'react-redux';
import { generatePath, matchPath } from 'react-router-dom';

import { LegacyPath, Path } from '@/config/routes';
import * as Domain from '@/ducks/domain';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import * as Version from '@/ducks/versionV2';
import { useActiveProjectPlatformConfig, useSelector } from '@/hooks';
import RedirectWithSearch from '@/Routes/RedirectWithSearch';

const DiagramGate: React.FC<React.PropsWithChildren> = ({ children }) => {
  const dispatch = useDispatch();
  const version = useSelector(Version.active.versionSelector);
  const rootDomainID = useSelector(Domain.rootDomainIDSelector);
  const hasActiveDomain = useSelector(Session.hasActiveDomainSelector);
  const hasActiveDiagram = useSelector(Session.hasActiveDiagramSelector);

  const platformConfig = useActiveProjectPlatformConfig();
  const getDomainIDByTopicID = useSelector(Domain.getDomainIDByTopicIDSelector);

  React.useEffect(() => {
    if (!version || !rootDomainID) return Utils.functional.noop;

    const { pathname } = window.location;
    const { id: versionID, rootDiagramID } = version;

    const domainMatch = matchPath<{ domainID: string }>(pathname, { path: Path.PROJECT_DOMAIN });
    const canvasMatch = matchPath<{ domainID: string; diagramID?: string }>(pathname, { path: Path.DOMAIN_CANVAS });
    const legacyCanvasMatch = matchPath<{ diagramID?: string }>(pathname, { path: LegacyPath.PROJECT_CANVAS });

    const diagramID = canvasMatch?.params.diagramID ?? legacyCanvasMatch?.params.diagramID ?? rootDiagramID;
    const domainID = canvasMatch?.params.domainID ?? getDomainIDByTopicID({ topicID: diagramID }) ?? rootDomainID;

    // we need this hack to make sure that url is updated before we render children
    // otherwise we will get an old url in the diagram/domain sync components
    const frame = requestAnimationFrame(() => {
      flushSync(() => {
        if (domainMatch && !domainMatch.params.domainID) {
          dispatch(Router.redirectToCanvas({ domainID, diagramID, versionID }));
        } else if (canvasMatch && !canvasMatch.params.diagramID) {
          dispatch(Router.redirectToCanvas({ domainID, diagramID, versionID }));
        } else if (legacyCanvasMatch) {
          const matchedPath = generatePath(LegacyPath.PROJECT_CANVAS, legacyCanvasMatch.params);

          dispatch(Router.redirectToCanvas({ domainID, diagramID, versionID, extraPath: pathname.replace(matchedPath, '') }));
        }
      });

      dispatch(Session.setActiveDomainID(domainID));
      dispatch(Session.setActiveDiagramID(diagramID));
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  if (!version || !rootDomainID || platformConfig.isDeprecated) return <RedirectWithSearch to={Path.DASHBOARD} />;

  if (!hasActiveDiagram || !hasActiveDomain) return null;

  return <>{children}</>;
};

export default DiagramGate;
