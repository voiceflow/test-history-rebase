import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';
import { Helmet } from 'react-helmet';
import IdleTimer from 'react-idle-timer';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom';

import { RemoveIntercom } from '@/components/IntercomChat';
import { Path } from '@/config/routes';
import { ModalType } from '@/constants';
import * as DiagramV2 from '@/ducks/diagramV2';
import * as ProjectV2 from '@/ducks/projectV2';
import * as UI from '@/ducks/ui';
import { VersionSubscriptionGate, WorkspaceFeatureLoadingGate } from '@/gates';
import { lazy, withBatchLoadingGate } from '@/hocs';
import {
  useDispatch,
  useEventualEngine,
  useFeature,
  useLayoutDidUpdate,
  useLocalDispatch,
  useModals,
  useSelector,
  useTeardown,
  useTheme,
} from '@/hooks';
import ExportModelModal from '@/pages/Canvas/components/ExportModelModal';
import ManualSaveModal from '@/pages/Canvas/components/ManualSaveModal';
import InactivityModal from '@/pages/Inactivity';
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
const Conversations = lazy(() => import('@/pages/Conversations'));
const NLUManager = lazy(() => import('@/pages/NLUManager'));

export type ProjectProps = RouteComponentProps;

const Project: React.FC = () => {
  const theme = useTheme();
  const getEngine = useEventualEngine();
  const canvasOnly = useSelector(UI.isCanvasOnlyShowingSelector);
  const platform = useSelector(ProjectV2.active.platformSelector);
  const projectType = useSelector(ProjectV2.active.projectTypeSelector);
  const projectName = useSelector(ProjectV2.active.nameSelector);
  const isOnlyViewer = useSelector(DiagramV2.isOnlyViewerSelector);
  const setPreviewing = useDispatch(UI.setPreviewingVersion);
  const resetCreator = useLocalDispatch(Realtime.creator.reset);

  const inactivityModal = useModals(ModalType.INACTIVITY);
  const nluManager = useFeature(Realtime.FeatureFlag.NLU_MANAGER);

  const isPreviewRoute = useProjectPreviewMode();

  React.useEffect(() => {
    setPreviewing(!!isPreviewRoute);
  }, [isPreviewRoute]);

  const idleTimer = React.useRef<IdleTimer | null>(null);

  const setActive = React.useCallback(() => {
    inactivityModal.close();
    idleTimer.current?.reset();
  }, [inactivityModal.close]);

  const setIdle = React.useCallback(() => {
    inactivityModal.open();
    idleTimer.current?.pause();
  }, []);

  useLayoutDidUpdate(() => {
    const engine = getEngine();

    const position = engine?.canvas?.getPosition();
    const { height } = theme.components.projectPage.header;

    if (position) {
      engine?.canvas?.setPosition([position[0], position[1] + (canvasOnly ? height : -height)]);
    }
  }, [canvasOnly]);

  useTeardown(() => resetCreator());

  return (
    <MarkupProvider>
      <ProjectProvider platform={platform} projectType={projectType}>
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

            <InactivityModal onActive={setActive} />
          </>
        )}

        <ExportModelModal />

        <ProjectExitTracker platform={platform} />
        <RemoveIntercom />

        <Providers>
          <Switch>
            <Route path={DIAGRAM_ROUTES} component={Diagram} />

            <Route path={Path.CONVERSATIONS} component={Conversations} />

            {nluManager.isEnabled && <Route path={Path.NLU_MANAGER} component={NLUManager} />}

            <Route path={Path.PROJECT_TOOLS} component={Business} />

            <Route path={Path.PROJECT_MIGRATE} component={Migrate} />

            <Route path={Path.PROTOTYPE_WEBHOOK} component={PrototypeWebhook} />

            <Route path={Path.PROJECT_PUBLISH} component={Publish} />

            <Route path={Path.PROJECT_SETTINGS} component={Settings} />

            <Redirect to={Path.PROJECT_CANVAS} />
          </Switch>
          <ManualSaveModal />
        </Providers>
      </ProjectProvider>
    </MarkupProvider>
  );
};

export default withBatchLoadingGate(VersionSubscriptionGate, WorkspaceFeatureLoadingGate)(Project);
