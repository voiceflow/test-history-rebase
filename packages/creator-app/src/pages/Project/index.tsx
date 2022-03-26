import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';
import { Helmet } from 'react-helmet';
import IdleTimer from 'react-idle-timer';
import { batch } from 'react-redux';
import { Redirect, Route, RouteComponentProps, Switch, useRouteMatch } from 'react-router-dom';

import { RemoveIntercom } from '@/components/IntercomChat';
import ProjectPage from '@/components/ProjectPage';
import { Path } from '@/config/routes';
import { ModalType } from '@/constants';
import { ExportProvider, PublishProvider } from '@/contexts';
import * as Creator from '@/ducks/creator';
import * as ProjectV2 from '@/ducks/projectV2';
import * as RealtimeDuck from '@/ducks/realtime';
import * as UI from '@/ducks/ui';
import { PlanRestrictionGate, ProjectLockGate, VersionSubscriptionGate, WorkspaceFeatureLoadingGate } from '@/gates';
import { lazy, withBatchLoadingGate } from '@/hocs';
import { useDispatch, useEventualEngine, useLayoutDidUpdate, useLocalDispatch, useModals, useSelector, useTeardown, useTheme } from '@/hooks';
import ExportModelModal from '@/pages/Canvas/components/ExportModelModal';
import NonRouteIMM from '@/pages/Canvas/components/InteractionModelModal/NonRouteIMM';
import ManualSaveModal from '@/pages/Canvas/components/ManualSaveModal';
import InactivityModal from '@/pages/Inactivity';
import { useProjectPreviewMode } from '@/pages/Project/hooks';
import { PrototypeProvider } from '@/pages/Prototype/context';
import PrototypeWebhook from '@/pages/PrototypeWebhook';

import Header from './components/Header';
import ProjectExitTracker from './components/ProjectExitTracker';
import Sidebar from './components/Sidebar';
import { TIMEOUT_COUNT } from './constants';
import { LastCreatedComponentProvider, MarkupProvider, NLPProvider, ProjectProvider, SelectionProvider } from './contexts';

const Diagram = lazy(() => import('./components/Diagram'));
const Business = lazy(() => import('@/pages/Business'));
const Migrate = lazy(() => import('@/pages/Migrate'));
const Publish = lazy(() => import('@/pages/Publish'));
const Settings = lazy(() => import('@/pages/Settings'));
const Conversations = lazy(() => import('@/pages/Conversations'));

export type ProjectProps = RouteComponentProps;

const DIAGRAM_ROUTES = [Path.PROJECT_PROTOTYPE, Path.PROJECT_CANVAS, Path.CANVAS_COMMENTING, Path.CANVAS_MODEL, Path.CANVAS_MODEL_ENTITY];

const Project: React.FC = () => {
  const theme = useTheme();
  const getEngine = useEventualEngine();
  const canvasOnly = useSelector(UI.isCanvasOnlyShowingSelector);
  const platform = useSelector(ProjectV2.active.platformSelector);
  const typeV2 = useSelector(ProjectV2.active.typeV2Selector);
  const platformV2 = useSelector(ProjectV2.active.platformV2Selector);
  const projectName = useSelector(ProjectV2.active.nameSelector);
  const isOnlyViewer = useSelector(RealtimeDuck.isOnlyViewerSelector);
  const isDiagramRoute = useRouteMatch(DIAGRAM_ROUTES);
  const setPreviewing = useDispatch(UI.setPreviewingVersion);
  const resetCreator = useDispatch(Creator.resetCreator);
  const resetCreatorV2 = useLocalDispatch(Realtime.creator.reset);

  const inactivityModal = useModals(ModalType.INACTIVITY);

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

  useTeardown(() =>
    batch(() => {
      resetCreator();
      resetCreatorV2();
    })
  );

  return (
    <MarkupProvider>
      <ProjectProvider platform={platform} platformV2={platformV2} typeV2={typeV2}>
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

        <NonRouteIMM />
        <ExportModelModal />

        <ProjectExitTracker platform={platform} />
        <RemoveIntercom />

        <PrototypeProvider>
          <PublishProvider>
            <ExportProvider>
              <NLPProvider>
                <SelectionProvider>
                  <LastCreatedComponentProvider>
                    <ProjectPage
                      scrollable={!isDiagramRoute}
                      renderHeader={() => !canvasOnly && <Header />}
                      renderSidebar={() => !canvasOnly && <Sidebar />}
                    >
                      <Switch>
                        <Route path={DIAGRAM_ROUTES} component={Diagram} />

                        <Route path={Path.CONVERSATIONS} component={Conversations} />

                        <Route path={Path.PROJECT_TOOLS} component={Business} />

                        <Route path={Path.PROJECT_MIGRATE} component={Migrate} />

                        <Route path={Path.PROTOTYPE_WEBHOOK} component={PrototypeWebhook} />

                        <Route path={Path.PROJECT_PUBLISH} component={Publish} />

                        <Route path={Path.PROJECT_SETTINGS} component={Settings} />

                        <Redirect to={Path.PROJECT_CANVAS} />
                      </Switch>
                      <ManualSaveModal />
                    </ProjectPage>
                  </LastCreatedComponentProvider>
                </SelectionProvider>
              </NLPProvider>
            </ExportProvider>
          </PublishProvider>
        </PrototypeProvider>
      </ProjectProvider>
    </MarkupProvider>
  );
};

export default withBatchLoadingGate(VersionSubscriptionGate, PlanRestrictionGate, ProjectLockGate, WorkspaceFeatureLoadingGate)(Project);
