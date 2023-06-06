import * as Realtime from '@voiceflow/realtime-sdk';
import { System, usePersistFunction } from '@voiceflow/ui';
import React from 'react';
import { Helmet } from 'react-helmet';
import { useIdleTimer } from 'react-idle-timer';
import { Redirect, Route, Switch } from 'react-router-dom';

import { useKnowledgeBase } from '@/components/GPT/hooks/feature';
import InactivitySnackbar from '@/components/InactivitySnackbar';
import { Path } from '@/config/routes';
import * as DiagramV2 from '@/ducks/diagramV2';
import * as ProjectV2 from '@/ducks/projectV2';
import * as UI from '@/ducks/ui';
import { VersionSubscriptionGate, WorkspaceFeatureLoadingGate } from '@/gates';
import { lazy } from '@/hocs/lazy';
import { withBatchLoadingGate } from '@/hocs/withBatchLoadingGate';
import { withWorkspaceOrProjectAssetsSuspense } from '@/hocs/withWorkspaceOrProjectAssetsSuspense';
import { useEventualEngine, useFeature, useLayoutDidUpdate, useLocalDispatch, useSelector, useTeardown, useTheme } from '@/hooks';
import Providers from '@/pages/Project/Providers';
import PrototypeWebhook from '@/pages/PrototypeWebhook';

import ProjectExitTracker from './components/ProjectExitTracker';
import { DIAGRAM_ROUTES, TIMEOUT_COUNT } from './constants';
import { MarkupProvider } from './contexts';

const Diagram = withWorkspaceOrProjectAssetsSuspense(lazy(() => import('./components/Diagram')));
const Migrate = withWorkspaceOrProjectAssetsSuspense(lazy(() => import('@/pages/Migrate')));
const Publish = withWorkspaceOrProjectAssetsSuspense(lazy(() => import('@/pages/Publish')));
const Settings = withWorkspaceOrProjectAssetsSuspense(lazy(() => import('@/pages/Settings')));
const NLUManager = withWorkspaceOrProjectAssetsSuspense(
  lazy(() => import('@/pages/NLUManager')),
  'NLU Data'
);
const Conversations = withWorkspaceOrProjectAssetsSuspense(lazy(() => import('@/pages/Conversations')));
const AnalyticsDashboard = withWorkspaceOrProjectAssetsSuspense(lazy(() => import('@/pages/AnalyticsDashboard')));
const KnowledgeBase = withWorkspaceOrProjectAssetsSuspense(lazy(() => import('@/pages/KnowledgeBase')));

const Project: React.FC = () => {
  const theme = useTheme();
  const getEngine = useEventualEngine();
  const canvasOnly = useSelector(UI.isCanvasOnlyShowingSelector);
  const projectName = useSelector(ProjectV2.active.nameSelector);
  const isOnlyViewer = useSelector(DiagramV2.isOnlyViewerSelector);
  const resetCreator = useLocalDispatch(Realtime.creator.reset);
  const resetCanvasTemplateData = useLocalDispatch(Realtime.canvasTemplate.reset);

  const nluManager = useFeature(Realtime.FeatureFlag.NLU_MANAGER);
  const disableIntegration = useFeature(Realtime.FeatureFlag.DISABLE_INTEGRATION)?.isEnabled;
  const knowledgeBase = useKnowledgeBase();

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

          {nluManager.isEnabled && <Route path={Path.NLU_MANAGER} component={NLUManager} />}

          <Route path={Path.PROJECT_ANALYTICS} component={AnalyticsDashboard} />

          {knowledgeBase && <Route path={Path.PROJECT_KNOWLEDGE_BASE} component={KnowledgeBase} />}

          <Route path={Path.PROJECT_MIGRATE} component={Migrate} />

          <Route path={Path.PROTOTYPE_WEBHOOK} component={PrototypeWebhook} />

          {!disableIntegration && <Route path={Path.PROJECT_PUBLISH} component={Publish} />}

          <Route path={Path.PROJECT_SETTINGS} component={Settings} />

          <Redirect to={Path.PROJECT_CANVAS} />
        </Switch>
      </Providers>
    </MarkupProvider>
  );
};

export default withBatchLoadingGate(VersionSubscriptionGate, WorkspaceFeatureLoadingGate)(Project);
