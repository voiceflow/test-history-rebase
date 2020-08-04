import React from 'react';
import { Helmet } from 'react-helmet';
import IdleTimer from 'react-idle-timer';
import { Redirect, RouteComponentProps, Switch } from 'react-router-dom';
import { Alert } from 'reactstrap';

import PrivateRoute from '@/Routes/PrivateRoute';
import Page from '@/components/Page';
import { Permission } from '@/config/permissions';
import { Path } from '@/config/routes';
import * as Project from '@/ducks/project';
import * as Realtime from '@/ducks/realtime';
import * as Router from '@/ducks/router';
import * as SkillDuck from '@/ducks/skill';
import { PlanRestrictionGate, ProjectLoadingGate, ProjectLockGate, RealtimeLoadingGate, WorkspaceLoadingGate } from '@/gates';
import { connect, withBatchLoadingGate } from '@/hocs';
import { useCanvasTracking, useEnableDisable, usePermission } from '@/hooks';
import Business from '@/pages/Business';
import InactivityModal from '@/pages/Inactivity';
import Migrate from '@/pages/Migrate';
import Publish from '@/pages/Publish';
import { isOnlyViewerSelector } from '@/store/selectors';
import { ConnectedProps, MergeArguments } from '@/types';
import { compose } from '@/utils/functional';
import { getActivePageAndMatch } from '@/utils/routes';

import Diagram from './components/Diagram';
import ProjectTitle from './components/ProjectTitle';
import SkillSubHeader from './components/SkillSubHeader';
import { PAGES_MATCHES, TIMEOUT_COUNT } from './constants';
import { MarkupModeProvider } from './contexts';

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
  diagramID,
  activePage,
  activeSkill,
  goToDashboard,
  updateProjectName,
  isOnlyViewer,
}) => {
  const [isIdle, onIdle, onActive] = useEnableDisable();
  const [canEditCanvas] = usePermission(Permission.EDIT_CANVAS);

  const idleTimer = React.useRef<IdleTimer>(null);
  const isPrototyping = activePage === 'prototype';

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
    <MarkupModeProvider>
      <Helmet>
        <title>{activeSkill.name || 'Voiceflow Creator'}</title>
      </Helmet>
      {!isOnlyViewer && (
        <>
          <IdleTimer ref={idleTimer} element={document} onIdle={setIdle} debounce={250} timeout={TIMEOUT_COUNT} />
          <InactivityModal open={isIdle} onActive={setActive} />
        </>
      )}
      <Page
        header={<ProjectTitle title={activeSkill.name} canEdit={canEditCanvas && !isPrototyping} onChange={updateProjectName} />}
        userMenu={false}
        canScroll={false}
        subHeader={<SkillSubHeader showPublish={canEditCanvas} activePage={activePage} />}
        onNavigateBack={goToDashboard}
      >
        <Switch>
          <PrivateRoute
            path={[Path.PROJECT_PROTOTYPE, Path.PROJECT_CANVAS, Path.CANVAS_COMMENTING, Path.CANVAS_MODEL, Path.CANVAS_MODEL_ENTITY]}
            component={Diagram}
            diagramID={diagramID}
            isPrototyping={isPrototyping}
          />

          <PrivateRoute path={Path.PROJECT_TOOLS} component={Business} />

          <PrivateRoute path={Path.PROJECT_MIGRATE} component={Migrate} />

          <PrivateRoute path={Path.PROJECT_PUBLISH} component={Publish} />

          <Redirect to={Path.PROJECT_CANVAS} />
        </Switch>
      </Page>
    </MarkupModeProvider>
  );
};

const mapStateToProps = {
  activeSkill: SkillDuck.activeSkillSelector,
  isConnected: Realtime.isRealtimeConnectedSelector,
  isOnlyViewer: isOnlyViewerSelector,
};

const mapDispatchToProps = {
  goToDashboard: Router.goToDashboard,
  updateProjectName: Project.updateProjectName,
  updateSkillName: SkillDuck.saveSkillSettings,
};

const mergeProps = (
  ...[{ activeSkill }, { updateProjectName, updateSkillName }]: MergeArguments<typeof mapStateToProps, typeof mapDispatchToProps>
) => ({
  updateProjectName: (name: string) => {
    updateProjectName(activeSkill?.projectID, name);
    updateSkillName({ name });
  },
});

type ConnectedSkillProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps, typeof mergeProps>;

export default compose(
  connect(mapStateToProps, mapDispatchToProps, mergeProps),
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
    RealtimeLoadingGate
  )
)(Skill as any) as React.FC<SkillProps>;
