import * as Realtime from '@voiceflow/realtime-sdk';
import { System, usePersistFunction } from '@voiceflow/ui';
import React from 'react';
import { Helmet } from 'react-helmet';
import { useIdleTimer } from 'react-idle-timer';
import { Redirect, Route, Switch } from 'react-router-dom';

import InactivitySnackbar from '@/components/InactivitySnackbar';
import { Modal } from '@/components/Modal';
import { Path } from '@/config/routes';
import { Permission } from '@/constants/permissions';
import * as DiagramV2 from '@/ducks/diagramV2';
import * as ProjectV2 from '@/ducks/projectV2';
import { OrganizationSubscriptionGate, VersionSubscriptionGate } from '@/gates';
import { lazy } from '@/hocs/lazy';
import { withBatchLoadingGate } from '@/hocs/withBatchLoadingGate';
import { withWorkspaceOrProjectAssetsSuspense } from '@/hocs/withWorkspaceOrProjectAssetsSuspense';
import { useFeature, useLocalDispatch, usePermission, useSelector, useTeardown } from '@/hooks';
import { ModalScope } from '@/ModalsV2/modal-scope.enum';
import AssistantCMS from '@/pages/AssistantCMS/AssistantCMS.page';
import Providers from '@/pages/Project/Providers';

import Diagram from './components/Diagram';
import ProjectExitTracker from './components/ProjectExitTracker';
import { DIAGRAM_ROUTES, TIMEOUT_COUNT } from './constants';
import { MarkupProvider } from './contexts';
import { useProjectHotkeys } from './Project.hook';

const Publish = withWorkspaceOrProjectAssetsSuspense(lazy(() => import('@/pages/Publish')));
const Settings = withWorkspaceOrProjectAssetsSuspense(lazy(() => import('@/pages/Settings')));
const Conversations = withWorkspaceOrProjectAssetsSuspense(lazy(() => import('@/pages/Conversations')));
const AnalyticsDashboard = withWorkspaceOrProjectAssetsSuspense(lazy(() => import('@/pages/AnalyticsDashboard')));

const Project: React.FC = () => {
  const projectName = useSelector(ProjectV2.active.nameSelector);
  const isOnlyViewer = useSelector(DiagramV2.isOnlyViewerSelector);
  const resetCreator = useLocalDispatch(Realtime.creator.reset);
  const resetCanvasTemplateData = useLocalDispatch(Realtime.canvasTemplate.reset);

  const [canEditProject] = usePermission(Permission.PROJECT_EDIT);

  const hideExports = useFeature(Realtime.FeatureFlag.HIDE_EXPORTS);
  const disableIntegration = useFeature(Realtime.FeatureFlag.DISABLE_INTEGRATION);

  const inactivitySnackbar = System.Snackbar.useAPI();

  const setActive = usePersistFunction(() => {
    inactivitySnackbar.close();

    if (isOnlyViewer) {
      idleTimer.pause();
      return;
    }

    idleTimer.activate();
  });

  const setIdle = usePersistFunction(() => {
    inactivitySnackbar.open();
    idleTimer.pause();
  });

  const idleTimer = useIdleTimer({
    onIdle: setIdle,
    element: document,
    timeout: TIMEOUT_COUNT,
    debounce: 250,
    startOnMount: false,
    startManually: true,
  });

  React.useEffect(() => {
    if (isOnlyViewer) {
      idleTimer.pause();
      return;
    }

    idleTimer.start();
  }, [isOnlyViewer]);

  useProjectHotkeys();

  useTeardown(() => {
    resetCreator();
    resetCanvasTemplateData();
  });

  return (
    <MarkupProvider>
      <Helmet>
        <title>{projectName}</title>
      </Helmet>

      {!isOnlyViewer && inactivitySnackbar.isOpen && <InactivitySnackbar onDismiss={setActive} />}

      <Providers>
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
      </Providers>
    </MarkupProvider>
  );
};

export default withBatchLoadingGate(VersionSubscriptionGate, OrganizationSubscriptionGate)(Project);
