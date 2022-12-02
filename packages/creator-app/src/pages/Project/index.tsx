import * as Realtime from '@voiceflow/realtime-sdk';
import { Snackbar, usePersistFunction } from '@voiceflow/ui';
import React from 'react';
import { Helmet } from 'react-helmet';
import IdleTimer from 'react-idle-timer';
import { batch } from 'react-redux';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom';

import InactivitySnackbar from '@/components/InactivitySnackbar';
import { Path } from '@/config/routes';
import * as DiagramV2 from '@/ducks/diagramV2';
import * as ProjectV2 from '@/ducks/projectV2';
import * as UI from '@/ducks/ui';
import { VersionSubscriptionGate, WorkspaceFeatureLoadingGate } from '@/gates';
import { lazy, withBatchLoadingGate } from '@/hocs';
import { useDispatch, useEventualEngine, useFeature, useLayoutDidUpdate, useLocalDispatch, useSelector, useTeardown, useTheme } from '@/hooks';
import ExportModelModal from '@/pages/Canvas/components/ExportModelModal';
import { ExportProvider } from '@/pages/Project/components/Header/components/SharePopper/components/Export';
import { useProjectPreviewMode } from '@/pages/Project/hooks';
import Providers from '@/pages/Project/Providers';
import PrototypeWebhook from '@/pages/PrototypeWebhook';

import ProjectExitTracker from './components/ProjectExitTracker';
import { DIAGRAM_ROUTES, TIMEOUT_COUNT } from './constants';
import { MarkupProvider, ProjectProvider } from './contexts';

const Diagram = lazy(() => import('./components/Diagram'));
const Business = lazy(() => import('@/pages/Business'));
const Migrate = lazy(() => import('@/pages/Migrate'));
const Publish = lazy(() => import('@/pages/Publish'));
const Settings = lazy(() => import('@/pages/Settings'));
const AssistantOverview = lazy(() => import('@/pages/DashboardV2/pages/AssistantOverview'));
const Conversations = lazy(() => import('@/pages/Conversations'));
const NLUManager = lazy(() => import('@/pages/NLUManager'));

export type ProjectProps = RouteComponentProps;

const Project: React.FC = () => {
  const theme = useTheme();
  const nluType = useSelector(ProjectV2.active.nluTypeSelector);
  const platform = useSelector(ProjectV2.active.platformSelector);
  const getEngine = useEventualEngine();
  const canvasOnly = useSelector(UI.isCanvasOnlyShowingSelector);
  const projectType = useSelector(ProjectV2.active.projectTypeSelector);
  const projectName = useSelector(ProjectV2.active.nameSelector);
  const isOnlyViewer = useSelector(DiagramV2.isOnlyViewerSelector);
  const setPreviewing = useDispatch(UI.setPreviewingVersion);
  const resetCreator = useLocalDispatch(Realtime.creator.reset);
  const resetCanvasTemplateData = useLocalDispatch(Realtime.canvasTemplate.reset);
  const dashboardV2FF = useFeature(Realtime.FeatureFlag.DASHBOARD_V2);

  const inactivitySnackbar = Snackbar.useSnackbar();
  const nluManager = useFeature(Realtime.FeatureFlag.NLU_MANAGER);
  const disableIntegration = useFeature(Realtime.FeatureFlag.DISABLE_INTEGRATION)?.isEnabled;

  const isPreviewRoute = useProjectPreviewMode();

  const idleTimer = React.useRef<IdleTimer | null>(null);

  const setActive = usePersistFunction(() => {
    inactivitySnackbar.close();
    idleTimer.current?.reset();
  });

  const setIdle = usePersistFunction(() => {
    inactivitySnackbar.open();
    idleTimer.current?.pause();
  });

  React.useEffect(() => {
    setPreviewing(!!isPreviewRoute);
  }, [isPreviewRoute]);

  useLayoutDidUpdate(() => {
    const engine = getEngine();

    const position = engine?.canvas?.getPosition();
    const { height } = theme.components.page.header;

    if (position) {
      engine?.canvas?.setPosition([position[0], position[1] + (canvasOnly ? height : -height)]);
    }
  }, [canvasOnly]);

  useTeardown(() =>
    batch(() => {
      resetCreator();
      resetCanvasTemplateData();
    })
  );

  return (
    <MarkupProvider>
      <ProjectProvider nluType={nluType} platform={platform} projectType={projectType}>
        <Helmet>
          <title>{projectName}</title>
        </Helmet>

        {!isOnlyViewer && (
          <>
            <IdleTimer
              ref={(instance: IdleTimer) => {
                idleTimer.current = instance;
              }}
              element={document}
              onIdle={setIdle}
              debounce={250}
              timeout={TIMEOUT_COUNT}
            />
            <InactivitySnackbar {...inactivitySnackbar} onDismiss={setActive} />
          </>
        )}

        <ExportProvider>
          <ExportModelModal />
        </ExportProvider>

        <ProjectExitTracker nluType={nluType} platform={platform} />

        <Providers>
          <Switch>
            <Route path={DIAGRAM_ROUTES} component={Diagram} />

            <Route path={Path.CONVERSATIONS} component={Conversations} />

            {nluManager.isEnabled && <Route path={Path.NLU_MANAGER} component={NLUManager} />}

            <Route path={Path.PROJECT_TOOLS} component={Business} />

            <Route path={Path.PROJECT_MIGRATE} component={Migrate} />

            <Route path={Path.PROTOTYPE_WEBHOOK} component={PrototypeWebhook} />

            {!disableIntegration && <Route path={Path.PROJECT_PUBLISH} component={Publish} />}

            <Route path={Path.PROJECT_SETTINGS} component={Settings} />

            {dashboardV2FF.isEnabled && <Route path={Path.PROJECT_ASSISTANT_OVERVIEW} component={AssistantOverview} />}

            <Redirect to={Path.PROJECT_DOMAIN} />
          </Switch>
        </Providers>
      </ProjectProvider>
    </MarkupProvider>
  );
};

export default withBatchLoadingGate(VersionSubscriptionGate, WorkspaceFeatureLoadingGate)(Project);
