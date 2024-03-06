import * as Realtime from '@voiceflow/realtime-sdk';
import { System, usePersistFunction } from '@voiceflow/ui';
import React from 'react';
import { Helmet } from 'react-helmet';
import { useIdleTimer } from 'react-idle-timer';
import { Redirect, Route, Switch } from 'react-router-dom';

import InactivitySnackbar from '@/components/InactivitySnackbar';
import { Path } from '@/config/routes';
import { Permission } from '@/constants/permissions';
import * as DiagramV2 from '@/ducks/diagramV2';
import * as ProjectV2 from '@/ducks/projectV2';
import * as UI from '@/ducks/ui';
import { VersionSubscriptionGate } from '@/gates';
import { lazy } from '@/hocs/lazy';
import { withBatchLoadingGate } from '@/hocs/withBatchLoadingGate';
import { withWorkspaceOrProjectAssetsSuspense } from '@/hocs/withWorkspaceOrProjectAssetsSuspense';
import { useEventualEngine, useFeature, useLayoutDidUpdate, useLocalDispatch, usePermission, useSelector, useTeardown, useTheme } from '@/hooks';
import Providers from '@/pages/Project/Providers';

import ProjectExitTracker from './components/ProjectExitTracker';
import { DIAGRAM_ROUTES, TIMEOUT_COUNT } from './constants';
import { MarkupProvider } from './contexts';

const Diagram = withWorkspaceOrProjectAssetsSuspense(lazy(() => import('./components/Diagram')));
const Publish = withWorkspaceOrProjectAssetsSuspense(lazy(() => import('@/pages/Publish')));
const Settings = withWorkspaceOrProjectAssetsSuspense(lazy(() => import('@/pages/Settings')));
const AssistantCMS = withWorkspaceOrProjectAssetsSuspense(lazy(() => import('@/pages/AssistantCMS/AssistantCMS.page')));
const Conversations = withWorkspaceOrProjectAssetsSuspense(lazy(() => import('@/pages/Conversations')));
const AssistantOverview = withWorkspaceOrProjectAssetsSuspense(lazy(() => import('@/pages/DashboardV2/pages/AssistantOverview')));
const AnalyticsDashboard = withWorkspaceOrProjectAssetsSuspense(lazy(() => import('@/pages/AnalyticsDashboard')));

const Project: React.FC = () => {
  const theme = useTheme();
  const getEngine = useEventualEngine();
  const canvasOnly = useSelector(UI.isCanvasOnlyShowingSelector);
  const projectName = useSelector(ProjectV2.active.nameSelector);
  const isOnlyViewer = useSelector(DiagramV2.isOnlyViewerSelector);
  const resetCreator = useLocalDispatch(Realtime.creator.reset);
  const resetCanvasTemplateData = useLocalDispatch(Realtime.canvasTemplate.reset);

  const hideExports = useFeature(Realtime.FeatureFlag.HIDE_EXPORTS);
  const [canEditProject] = usePermission(Permission.PROJECT_EDIT);
  const disableIntegration = useFeature(Realtime.FeatureFlag.DISABLE_INTEGRATION)?.isEnabled;

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

  useLayoutDidUpdate(() => {
    const engine = getEngine();

    const position = engine?.canvas?.getPosition();
    const { height } = theme.components.page.header;

    if (position) {
      engine?.canvas?.setPosition([position[0], position[1] + (canvasOnly ? height : -height)]);
    }
  }, [canvasOnly]);

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

          <Route path={Path.CONVERSATIONS} component={Conversations} />

          <Route path={Path.PROJECT_ANALYTICS} component={AnalyticsDashboard} />

          {!disableIntegration && !hideExports.isEnabled && <Route path={Path.PROJECT_PUBLISH} component={Publish} />}

          <Route path={Path.PROJECT_SETTINGS} component={Settings} />

          <Route path={Path.PROJECT_ASSISTANT_OVERVIEW} component={AssistantOverview} />

          {canEditProject && <Route path={Path.PROJECT_CMS} component={AssistantCMS} />}

          <Redirect to={Path.PROJECT_DOMAIN} />
        </Switch>
      </Providers>
    </MarkupProvider>
  );
};

export default withBatchLoadingGate(VersionSubscriptionGate)(Project);
