import React from 'react';
import { Helmet } from 'react-helmet';
import IdleTimer from 'react-idle-timer';
import { batch } from 'react-redux';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom';

import Page from '@/components/Page';
import { Permission } from '@/config/permissions';
import { Path } from '@/config/routes';
import * as Creator from '@/ducks/creator';
import * as Project from '@/ducks/project';
import * as Realtime from '@/ducks/realtime';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import {
  PlanRestrictionGate,
  ProjectLoadingGate,
  ProjectLockGate,
  RealtimeLoadingGate,
  WorkspaceFeatureLoadingGate,
  WorkspacesLoadingGate,
} from '@/gates';
import { connect, lazy, withBatchLoadingGate } from '@/hocs';
import { useCanvasTracking, useEnableDisable, usePermission, useTeardown } from '@/hooks';
import CanvasHeader from '@/pages/Canvas/header';
import InactivityModal from '@/pages/Inactivity';
import PrototypeWebhook from '@/pages/PrototypeWebhook';
import { usePrototypingMode } from '@/pages/Skill/hooks';
import { ConnectedProps } from '@/types';
import { compose } from '@/utils/functional';
import { getActivePageAndMatch } from '@/utils/routes';

import ProjectSubHeader from './components/ProjectSubHeader';
import ProjectTitle from './components/ProjectTitle';
import { PAGES_MATCHES, TIMEOUT_COUNT } from './constants';
import { ExportProvider, MarkupProvider, NLPProvider, PlatformProvider, PublishProvider } from './contexts';

const Diagram = lazy(() => import(/* webpackPrefetch: true */ './components/Diagram'));
const Business = lazy(() => import('@/pages/Business'));
const Migrate = lazy(() => import('@/pages/Migrate'));
const Publish = lazy(() => import('@/pages/Publish'));

export type SkillProps = RouteComponentProps;

const Skill: React.FC<SkillProps & ConnectedSkillProps> = ({
  platform,
  location,
  projectName,
  goToDashboard,
  saveProjectName,
  goToDesign,
  isOnlyViewer,
  resetCreator,
  setActiveDiagramID,
  setActiveProjectID,
  setActiveVersionID,
}) => {
  const [isIdle, onIdle, onActive] = useEnableDisable();
  const [canEditCanvas] = usePermission(Permission.EDIT_CANVAS);
  const isPrototypingMode = usePrototypingMode();
  const activePage = React.useMemo(() => getActivePageAndMatch(PAGES_MATCHES, location.pathname).activePage ?? undefined, [location.pathname]);

  const idleTimer = React.useRef<IdleTimer>(null);

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

  return (
    <MarkupProvider>
      <PlatformProvider value={platform}>
        <Helmet>
          <title>{projectName}</title>
        </Helmet>
        {!isOnlyViewer && (
          <>
            <IdleTimer ref={idleTimer} element={document} onIdle={setIdle} debounce={250} timeout={TIMEOUT_COUNT} />
            <InactivityModal open={isIdle} onActive={setActive} />
          </>
        )}
        <PublishProvider>
          <ExportProvider>
            <NLPProvider>
              <Page
                header={!isPrototypingMode && <ProjectTitle title={projectName ?? ''} onChange={saveProjectName} />}
                subHeader={!isPrototypingMode && <ProjectSubHeader showPublish={canEditCanvas} activePage={activePage} />}
                canScroll={false}
                headerChildren={<CanvasHeader />}
                onNavigateBack={() => {
                  if (isPrototypingMode) {
                    goToDesign();
                  } else {
                    goToDashboard();
                  }
                }}
                navigateBackText={isPrototypingMode ? 'Back' : ''}
              >
                <Switch>
                  <Route
                    path={[Path.PROJECT_PROTOTYPE, Path.PROJECT_CANVAS, Path.CANVAS_COMMENTING, Path.CANVAS_MODEL, Path.CANVAS_MODEL_ENTITY]}
                    component={Diagram}
                  />

                  <Route path={Path.PROJECT_TOOLS} component={Business} />

                  <Route path={Path.PROJECT_MIGRATE} component={Migrate} />

                  <Route path={Path.PROTOTYPE_WEBHOOK} component={PrototypeWebhook} />

                  <Route path={Path.PROJECT_PUBLISH} component={Publish} />

                  <Redirect to={Path.PROJECT_CANVAS} />
                </Switch>
              </Page>
            </NLPProvider>
          </ExportProvider>
        </PublishProvider>
      </PlatformProvider>
    </MarkupProvider>
  );
};

const mapStateToProps = {
  projectName: Project.activeProjectNameSelector,
  isConnected: Realtime.isRealtimeConnectedSelector,
  platform: Project.activePlatformSelector,
  isOnlyViewer: Realtime.isOnlyViewerSelector,
};

const mapDispatchToProps = {
  saveProjectName: Project.saveProjectName,
  goToDashboard: Router.goToDashboard,
  goToDesign: Router.goToCurrentCanvas,
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
    WorkspaceFeatureLoadingGate,
    RealtimeLoadingGate
  )
)(Skill) as React.FC<SkillProps>;
