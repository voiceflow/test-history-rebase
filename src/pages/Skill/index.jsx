import React from 'react';
import { Helmet } from 'react-helmet';
import IdleTimer from 'react-idle-timer';
import { Redirect, Switch } from 'react-router-dom';
import { Alert } from 'reactstrap';
import { compose } from 'recompose';

import PrivateRoute from '@/Routes/PrivateRoute';
import Page from '@/components/Page';
import { FEATURE_IDS } from '@/constants';
import { usePermissions } from '@/contexts';
import { updateProjectName } from '@/ducks/project';
import * as Realtime from '@/ducks/realtime';
import { goToDashboard } from '@/ducks/router';
import { activeSkillSelector, saveSkillSettings } from '@/ducks/skill';
import { activeWorkspaceIDSelector } from '@/ducks/workspace/selectors';
import { PlanRestrictionGate, ProjectLoadingGate, ProjectLockGate, RealtimeLoadingGate, WorkspaceLoadingGate } from '@/gates';
import { connect, withBatchLoadingGate } from '@/hocs';
import { useCanvasTracking, useEnableDisable } from '@/hooks';
import Business from '@/pages/Business';
import InactivityModal from '@/pages/Inactivity';
import Migrate from '@/pages/Migrate';
import Publish from '@/pages/Publish';
import { isOnlyViewerSelector } from '@/store/selectors';
import { getActivePageAndMatch } from '@/utils/routes';

import Diagram from './components/Diagram';
import ProjectTitle from './components/ProjectTitle';
import SkillSubHeader from './components/SkillSubHeader';
import { MarkupModeProvider } from './contexts';

const PAGES_MATCHES = {
  prototype: ['/prototype/:diagramID?'],
  tools: ['/tools'],
  canvas: ['/canvas/:diagramID?'],
  migrate: ['/migrate'],
  publish: ['/publish'],
};

const TIMEOUT_COUNT = 5 * 60 * 1000;

function Skill({ match, error, diagramID, activeWorkspaceId, activePage, activeSkill = {}, goToDashboard, updateProjectName, isOnlyViewer }) {
  const [isIdle, onIdle, onActive] = useEnableDisable();
  const [canEditCanvas] = usePermissions(FEATURE_IDS.EDIT_CANVAS);

  const idleTimer = React.useRef();
  const isPrototyping = activePage === 'prototype';

  const setActive = React.useCallback(() => {
    onActive();
    idleTimer.current.reset();
  }, [onActive]);

  const setIdle = React.useCallback(() => {
    onIdle();
    idleTimer.current.pause();
  }, [onIdle]);

  useCanvasTracking(activeSkill.id);

  if (error) {
    return (
      <div className="super-center w-100 h-100">
        <Alert color="danger">{error}</Alert>
      </div>
    );
  }

  return (
    <MarkupModeProvider skillID={activeSkill.id} projectID={activeSkill.projectID} activeWorkspaceID={activeWorkspaceId}>
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
            path={[`${match.path}/prototype/:diagramID?`, `${match.path}/canvas/:diagramID?`]}
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
    </MarkupModeProvider>
  );
}

const mapStateToProps = {
  activeSkill: activeSkillSelector,
  isConnected: Realtime.isRealtimeConnectedSelector,
  activeWorkspaceId: activeWorkspaceIDSelector,
  isOnlyViewer: isOnlyViewerSelector,
};

const mapDispatchToProps = {
  goToDashboard,
  updateProjectName,
  updateSkillName: saveSkillSettings,
};

const mergeProps = ({ activeSkill }, { updateProjectName, updateSkillName }) => ({
  updateProjectName: (name) => {
    updateProjectName(activeSkill?.projectID, name);
    updateSkillName({ name });
  },
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps, mergeProps),
  withBatchLoadingGate(
    [
      ProjectLoadingGate,
      ({ match, location }) => {
        const { activePage, activePageMatch } = getActivePageAndMatch(PAGES_MATCHES, location.pathname, match.path);

        return {
          versionID: activePageMatch.params?.versionID,
          diagramID: activePageMatch.params?.diagramID,
          activePage,
        };
      },
    ],
    PlanRestrictionGate,
    ProjectLockGate,
    WorkspaceLoadingGate,
    RealtimeLoadingGate
  )
)(Skill);
