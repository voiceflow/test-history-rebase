import { Utils } from '@voiceflow/common';
import { FeatureFlag } from '@voiceflow/realtime-sdk';
import React from 'react';
import { flushSync } from 'react-dom';
import { useDispatch } from 'react-redux';
import { generatePath } from 'react-router-dom';

import { Path } from '@/config/routes';
import * as Domain from '@/ducks/domain';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import * as Version from '@/ducks/versionV2';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useActiveProjectPlatformConfig, useSelector } from '@/hooks';
import { useFeature } from '@/hooks/feature';
import RedirectWithSearch from '@/Routes/RedirectWithSearch';
import { matchPath } from '@/utils/route.util';

const DiagramGate: React.FC<React.PropsWithChildren> = ({ children }) => {
  const dispatch = useDispatch();
  const cmsWorkflows = useFeature(FeatureFlag.CMS_WORKFLOWS);

  const version = useSelector(Version.active.versionSelector);
  const rootDomainID = useSelector(Domain.rootDomainIDSelector);
  const hasActiveDomain = useSelector(Session.hasActiveDomainSelector);
  const hasActiveDiagram = useSelector(Session.hasActiveDiagramSelector);
  const organizationTrialExpired = useSelector(WorkspaceV2.active.organizationTrialExpiredSelector);
  const isEnterprise = useSelector(WorkspaceV2.active.isEnterpriseSelector);

  const platformConfig = useActiveProjectPlatformConfig();
  const getDomainIDByTopicID = useSelector(Domain.getDomainIDByTopicIDSelector);

  React.useEffect(() => {
    if (!version || !rootDomainID) return Utils.functional.noop;

    const { pathname } = window.location;
    const { id: versionID, rootDiagramID } = version;

    const domainCanvasMatch = matchPath(pathname, Path.DOMAIN_CANVAS);
    const projectDomainMatch = matchPath(pathname, Path.PROJECT_DOMAIN);
    const projectCanvasMatch = matchPath(pathname, Path.PROJECT_CANVAS);

    const diagramID = domainCanvasMatch?.params.diagramID ?? projectCanvasMatch?.params.diagramID ?? rootDiagramID;
    const domainID = domainCanvasMatch?.params.domainID ?? getDomainIDByTopicID({ topicID: diagramID }) ?? rootDomainID;

    // we need this hack to make sure that url is updated before we render children
    // otherwise we will get an old url in the diagram/domain sync components
    const frame = requestAnimationFrame(() => {
      flushSync(() => {
        if (cmsWorkflows.isEnabled) {
          if (projectCanvasMatch && !projectCanvasMatch.params.diagramID) {
            dispatch(Router.redirectToProjectCanvas({ versionID, diagramID }));
          }
        } else if (projectDomainMatch && !projectDomainMatch.params.domainID) {
          dispatch(Router.redirectToDomainCanvas({ domainID, diagramID, versionID }));
        } else if (domainCanvasMatch && !domainCanvasMatch.params.diagramID) {
          dispatch(Router.redirectToDomainCanvas({ domainID, diagramID, versionID }));
        } else if (projectCanvasMatch) {
          const matchedPath = generatePath(Path.PROJECT_CANVAS, projectCanvasMatch.params);

          dispatch(
            Router.redirectToDomainCanvas({
              domainID,
              diagramID,
              versionID,
              extraPath: pathname.replace(matchedPath, ''),
            })
          );
        }
      });

      if (!cmsWorkflows.isEnabled) {
        dispatch(Session.setActiveDomainID(domainID));
      }

      dispatch(Session.setActiveDiagramID(diagramID));
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  const isProTrialExpired = organizationTrialExpired && !isEnterprise;

  if (!version || (!rootDomainID && !cmsWorkflows.isEnabled) || platformConfig.isDeprecated || isProTrialExpired)
    return <RedirectWithSearch to={Path.DASHBOARD} />;

  if (!hasActiveDiagram || (!hasActiveDomain && !cmsWorkflows.isEnabled)) return null;

  return <>{children}</>;
};

export default DiagramGate;
