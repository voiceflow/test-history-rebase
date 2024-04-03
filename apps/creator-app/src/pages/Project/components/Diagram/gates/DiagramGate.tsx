import { Utils } from '@voiceflow/common';
import { FeatureFlag } from '@voiceflow/realtime-sdk';
import React from 'react';
import { flushSync } from 'react-dom';
import { useDispatch } from 'react-redux';
import { generatePath, matchPath } from 'react-router-dom';

import { LegacyPath, Path } from '@/config/routes';
import * as Domain from '@/ducks/domain';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import * as Version from '@/ducks/versionV2';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useActiveProjectPlatformConfig, useSelector } from '@/hooks';
import { useFeature } from '@/hooks/feature';
import RedirectWithSearch from '@/Routes/RedirectWithSearch';

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
