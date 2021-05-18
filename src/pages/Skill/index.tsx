import React from 'react';
import { Helmet } from 'react-helmet';
import IdleTimer from 'react-idle-timer';
import { Redirect, RouteComponentProps, Switch } from 'react-router-dom';
import { Alert } from 'reactstrap';

import Page from '@/components/Page';
import { Permission } from '@/config/permissions';
import { Path } from '@/config/routes';
import * as Project from '@/ducks/project';
import * as Realtime from '@/ducks/realtime';
import * as Router from '@/ducks/router';
import * as SkillDuck from '@/ducks/skill';
import {
  PlanRestrictionGate,
  ProjectLoadingGate,
  ProjectLockGate,
  RealtimeLoadingGate,
  WorkspaceFeatureLoadingGate,
  WorkspaceLoadingGate,
} from '@/gates';
import { connect, lazy, withBatchLoadingGate } from '@/hocs';
import { useCanvasTracking, useEnableDisable, usePermission } from '@/hooks';
import CanvasHeader from '@/pages/Canvas/header';
import InactivityModal from '@/pages/Inactivity';
import PrototypeWebhook from '@/pages/PrototypeWebhook';
import { usePrototypingMode } from '@/pages/Skill/hooks';
import PrivateRoute from '@/Routes/PrivateRoute';
import { isOnlyViewerSelector } from '@/store/selectors';
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

export type InjectedSkillProps = {
  versionID: string;
  diagramID: string;
  activePage: string;
  // TODO: figure out if this prop is used
  error?: string;
};

const Skill: React.FC<SkillProps & InjectedSkillProps & ConnectedSkillProps> = ({
  error,
  platform,
  diagramID,
  activePage,
  activeSkill,
  goToDashboard,
  saveProjectName,
  goToDesign,
  isOnlyViewer,
}) => {
  const [isIdle, onIdle, onActive] = useEnableDisable();
  const [canEditCanvas] = usePermission(Permission.EDIT_CANVAS);
  const isPrototypingMode = usePrototypingMode();

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

  if (error) {
    return (
      <div className="super-center w-100 h-100">
        <Alert color="danger">{error}</Alert>
      </div>
    );
  }

  return (
    <MarkupProvider>
      <PlatformProvider value={platform}>
        <Helmet>
          <title>{activeSkill.name || 'Voiceflow Creator'}</title>
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
                header={!isPrototypingMode && <ProjectTitle title={activeSkill.name} onChange={saveProjectName} />}
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
                  <PrivateRoute
                    path={[Path.PROJECT_PROTOTYPE, Path.PROJECT_CANVAS, Path.CANVAS_COMMENTING, Path.CANVAS_MODEL, Path.CANVAS_MODEL_ENTITY]}
                    component={Diagram}
                    diagramID={diagramID}
                  />

                  <PrivateRoute path={Path.PROJECT_TOOLS} component={Business} />

                  <PrivateRoute path={Path.PROJECT_MIGRATE} component={Migrate} />

                  <PrivateRoute path={Path.PROTOTYPE_WEBHOOK} component={PrototypeWebhook} />

                  <PrivateRoute path={Path.PROJECT_PUBLISH} component={Publish} />

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
  activeSkill: SkillDuck.activeSkillSelector,
  isConnected: Realtime.isRealtimeConnectedSelector,
  platform: Project.activePlatformSelector,
  isOnlyViewer: isOnlyViewerSelector,
};

const mapDispatchToProps = {
  saveProjectName: SkillDuck.saveProjectName,
  goToDashboard: Router.goToDashboard,
  goToDesign: Router.goToCurrentCanvas,
};

type ConnectedSkillProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withBatchLoadingGate(
    [
      ProjectLoadingGate,
      ({ location }: RouteComponentProps) => {
        const { activePage, activePageMatch } = getActivePageAndMatch<{ versionID?: string; diagramID?: string }>(PAGES_MATCHES, location.pathname);

        return {
          versionID: activePageMatch?.params?.versionID,
          diagramID: activePageMatch?.params?.diagramID,
          activePage,
        };
      },
    ],
    PlanRestrictionGate,
    ProjectLockGate,
    WorkspaceLoadingGate,
    WorkspaceFeatureLoadingGate,
    RealtimeLoadingGate
  )
)(Skill as any) as React.FC<SkillProps>;
