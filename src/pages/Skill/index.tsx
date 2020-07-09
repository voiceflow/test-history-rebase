import React from 'react';
import { Helmet } from 'react-helmet';
import IdleTimer from 'react-idle-timer';
import { Redirect, RouteComponentProps, Switch } from 'react-router-dom';
import { Alert } from 'reactstrap';

import PrivateRoute from '@/Routes/PrivateRoute';
import Page from '@/components/Page';
import { Permission } from '@/config/permissions';
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
import { CommentModeProvider, MarkupModeProvider } from './contexts';

const PAGES_MATCHES = {
  prototype: ['/prototype/:diagramID?'],
  tools: ['/tools'],
  canvas: ['/canvas/:diagramID?', '/canvas/:diagramID/commenting'],
  migrate: ['/migrate'],
  publish: ['/publish'],
};

const TIMEOUT_COUNT = 5 * 60 * 1000;

export type SkillProps = RouteComponentProps & {
  versionID: string;
  diagramID: string;
  activePage: string;
  // TODO: figure out if this prop is used
  error?: string;
};

const Skill: React.FC<SkillProps & ConnectedSkillProps> = ({
  match,
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
      <CommentModeProvider>
        <Page
          header={<ProjectTitle title={activeSkill.name} canEdit={canEditCanvas && !isPrototyping} onChange={updateProjectName} />}
          userMenu={false}
          canScroll={false}
          subHeader={<SkillSubHeader showPublish={canEditCanvas} activePage={activePage} />}
          onNavigateBack={goToDashboard}
        >
          <Switch>
            <PrivateRoute
              path={[`${match.path}/prototype/:diagramID?`, `${match.path}/canvas/:diagramID?`, `${match.path}/canvas/:diagramID/commenting`]}
              component={Diagram}
              diagramID={diagramID}
              isPrototyping={isPrototyping}
            />

            <PrivateRoute path={`${match.path}/tools`} component={Business} />

            <PrivateRoute path={`${match.path}/migrate`} component={Migrate} />

            <PrivateRoute path={`${match.path}/publish`} component={Publish} />

            <Redirect to={`${match.path}/canvas`} />
          </Switch>
        </Page>
      </CommentModeProvider>
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
      ({ match, location }: RouteComponentProps) => {
        const { activePage, activePageMatch } = getActivePageAndMatch<{ versionID?: string; diagramID?: string }>(
          PAGES_MATCHES,
          location.pathname,
          match.path
        );

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
