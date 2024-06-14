import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';
import { Helmet } from 'react-helmet';
import { Redirect, Route, Switch } from 'react-router-dom';

import { Modal } from '@/components/Modal';
import { Path } from '@/config/routes';
import { Permission } from '@/constants/permissions';
import * as ProjectV2 from '@/ducks/projectV2';
import { OrganizationSubscriptionGate, VersionSubscriptionGate } from '@/gates';
import { lazy } from '@/hocs/lazy';
import { withBatchLoadingGate } from '@/hocs/withBatchLoadingGate';
import { withWorkspaceOrProjectAssetsSuspense } from '@/hocs/withWorkspaceOrProjectAssetsSuspense';
import { useFeature, useLocalDispatch, usePermission, useSelector, useTeardown } from '@/hooks';
import { ModalScope } from '@/ModalsV2/modal-scope.enum';
import AssistantCMS from '@/pages/AssistantCMS/AssistantCMS.page';
import { ProjectProviders } from '@/pages/Project/Providers';

import Diagram from './components/Diagram';
import ProjectExitTracker from './components/ProjectExitTracker';
import { DIAGRAM_ROUTES } from './constants';
import { IddleWarning } from './IddleWarning';
import { useProjectHotkeys } from './Project.hook';

const Publish = withWorkspaceOrProjectAssetsSuspense(lazy(() => import('@/pages/Publish')));
const Settings = withWorkspaceOrProjectAssetsSuspense(lazy(() => import('@/pages/Settings')));
const Conversations = withWorkspaceOrProjectAssetsSuspense(lazy(() => import('@/pages/Conversations')));
const AnalyticsDashboard = withWorkspaceOrProjectAssetsSuspense(lazy(() => import('@/pages/AnalyticsDashboard')));

const ProjectPage: React.FC = () => {
  const projectName = useSelector(ProjectV2.active.nameSelector);
  const resetCreator = useLocalDispatch(Realtime.creator.reset);
  const resetCanvasTemplateData = useLocalDispatch(Realtime.canvasTemplate.reset);

  const [canEditProject] = usePermission(Permission.PROJECT_UPDATE);

  const hideExports = useFeature(Realtime.FeatureFlag.HIDE_EXPORTS);
  const disableIntegration = useFeature(Realtime.FeatureFlag.DISABLE_INTEGRATION);

  useProjectHotkeys();

  useTeardown(() => {
    resetCreator();
    resetCanvasTemplateData();
  });

  return (
    <>
      <Helmet>
        <title>{projectName}</title>
      </Helmet>
      <IddleWarning />

      <ProjectProviders>
        <ProjectExitTracker />

        <Switch>
          <Route path={DIAGRAM_ROUTES} component={Diagram} />

          <Route path={Path.PROJECT_CONVERSATIONS} component={Conversations} />

          <Route path={Path.PROJECT_ANALYTICS} component={AnalyticsDashboard} />

          {!disableIntegration.isEnabled && !hideExports.isEnabled && (
            <Route path={Path.PROJECT_PUBLISH} component={Publish} />
          )}

          <Route path={Path.PROJECT_SETTINGS} component={Settings} />

          {canEditProject && <Route path={Path.PROJECT_CMS} component={AssistantCMS} />}

          <Redirect to={Path.PROJECT_CANVAS} />
        </Switch>

        {/* allows rendering cms related modals in the cms page tree, so we can easily use cms related context in the modals */}
        <Modal.Placeholder scope={ModalScope.PROJECT} />
      </ProjectProviders>
    </>
  );
};

export default withBatchLoadingGate(VersionSubscriptionGate, OrganizationSubscriptionGate)(ProjectPage);
