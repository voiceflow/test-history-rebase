import React from 'react';
import { Helmet } from 'react-helmet';
import IdleTimer from 'react-idle-timer';
import { batch } from 'react-redux';
import { Redirect, Route, RouteComponentProps, Switch, useRouteMatch } from 'react-router-dom';

import { RemoveIntercom } from '@/components/IntercomChat';
import ProjectPage from '@/components/ProjectPage';
import { Path } from '@/config/routes';
import * as Creator from '@/ducks/creator';
import * as Project from '@/ducks/project';
import * as Realtime from '@/ducks/realtime';
import * as Session from '@/ducks/session';
import * as UI from '@/ducks/ui';
import {
  PlanRestrictionGate,
  ProjectLoadingGate,
  ProjectLockGate,
  RealtimeLoadingGate,
  WorkspaceFeatureLoadingGate,
  WorkspaceLoadingGate,
  WorkspacesLoadingGate,
} from '@/gates';
import { connect, lazy, withBatchLoadingGate } from '@/hocs';
import { useCanvasTracking, useEnableDisable, useEventualEngine, useLayoutDidUpdate, useSelector, useTeardown, useTheme } from '@/hooks';
import InactivityModal from '@/pages/Inactivity';
import PrototypeWebhook from '@/pages/PrototypeWebhook';
import { ConnectedProps } from '@/types';
import { compose } from '@/utils/functional';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import { TIMEOUT_COUNT } from './constants';
import { ExportProvider, MarkupProvider, NLPProvider, PlatformProvider, PublishProvider } from './contexts';

const Diagram = lazy(() => import(/* webpackPrefetch: true */ './components/Diagram'));
const Business = lazy(() => import('@/pages/Business'));
const Migrate = lazy(() => import('@/pages/Migrate'));
const Publish = lazy(() => import('@/pages/Publish'));
const Settings = lazy(() => import('@/pages/Settings'));
const Conversations = lazy(() => import('@/pages/Conversations'));

export type SkillProps = RouteComponentProps;

const DIAGRAM_ROUTES = [Path.PROJECT_PROTOTYPE, Path.PROJECT_CANVAS, Path.CANVAS_COMMENTING, Path.CANVAS_MODEL, Path.CANVAS_MODEL_ENTITY];

const Skill: React.FC<SkillProps & ConnectedSkillProps> = ({
  platform,
  projectName,
  isOnlyViewer,
  resetCreator,
  setActiveDiagramID,
  setActiveProjectID,
  setActiveVersionID,
}) => {
  const theme = useTheme();
  const getEngine = useEventualEngine();
  const canvasOnly = useSelector(UI.isCanvasOnlyShowingSelector);
  const isDiagramRoute = useRouteMatch(DIAGRAM_ROUTES);

  const [isIdle, onIdle, onActive] = useEnableDisable();

  const idleTimer = React.useRef<IdleTimer | null>(null);

  const setActive = React.useCallback(() => {
    onActive();
    idleTimer.current?.reset();
  }, [onActive]);

  const setIdle = React.useCallback(() => {
    onIdle();
    idleTimer.current?.pause();
  }, [onIdle]);

  useCanvasTracking();

  useTeardown(() => {
    batch(() => {
      resetCreator();
      setActiveDiagramID(null);
      setActiveProjectID(null);
      setActiveVersionID(null);
    });
  });

  useLayoutDidUpdate(() => {
    const engine = getEngine();

    const position = engine?.canvas?.getPosition();
    const { height } = theme.components.projectPage.header;

    if (position) {
      engine?.canvas?.setPosition([position[0], position[1] + (canvasOnly ? height : -height)]);
    }
  }, [canvasOnly]);

  return (
    <MarkupProvider>
      <PlatformProvider value={platform}>
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

            <InactivityModal open={isIdle} onActive={setActive} />
          </>
        )}

        <RemoveIntercom />

        <PublishProvider>
          <ExportProvider>
            <NLPProvider>
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
              </ProjectPage>
            </NLPProvider>
          </ExportProvider>
        </PublishProvider>
      </PlatformProvider>
    </MarkupProvider>
  );
};

const mapStateToProps = {
  platform: Project.activePlatformSelector,
  projectName: Project.activeProjectNameSelector,
  isConnected: Realtime.isRealtimeConnectedSelector,
  isOnlyViewer: Realtime.isOnlyViewerSelector,
};

const mapDispatchToProps = {
  resetCreator: Creator.resetCreator,
  setActiveDiagramID: Session.setActiveDiagramID,
  setActiveProjectID: Session.setActiveProjectID,
  setActiveVersionID: Session.setActiveVersionID,
};

type ConnectedSkillProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withBatchLoadingGate(
    ProjectLoadingGate,
    PlanRestrictionGate,
    ProjectLockGate,
    WorkspacesLoadingGate,
    WorkspaceLoadingGate,
    WorkspaceFeatureLoadingGate,
    RealtimeLoadingGate
  )
)(Skill) as React.FC<SkillProps>;
