import React from 'react';
import { Helmet } from 'react-helmet';
import IdleTimer from 'react-idle-timer';
import { Redirect, Switch } from 'react-router-dom';
import { Alert } from 'reactstrap';
import { compose } from 'recompose';

import PrivateRoute from '@/Routes/PrivateRoute';
import Page from '@/components/Page';
import { FEATURE_IDS } from '@/constants';
import { usePermissions } from '@/contexts/RolePermissionsContext';
import { updateProjectName } from '@/ducks/project';
import * as Realtime from '@/ducks/realtime';
import { goToDashboard } from '@/ducks/router';
import { activeSkillSelector, saveSkillSettings } from '@/ducks/skill';
import { ProjectLoadingGate, ProjectLockGate, RealtimeLoadingGate, WorkspaceLoadingGate } from '@/gates';
import { connect, withBatchLoadingGate } from '@/hocs';
import { useCanvasTracking, useEnableDisable } from '@/hooks';
import Business from '@/pages/Business';
import Canvas from '@/pages/Canvas';
import CanvasMenu from '@/pages/Canvas/components/CanvasMenu';
import { EditPermissionProvider, ManagerProvider, ShortcutModalProvider } from '@/pages/Canvas/contexts';
import CanvasHeader from '@/pages/Canvas/header';
import { getManager } from '@/pages/Canvas/managers';
import InactivityModal from '@/pages/Inactivity';
import Migrate from '@/pages/Migrate';
import Publish from '@/pages/Publish';
import { SettingsModalProvider } from '@/pages/Settings/contexts';
import Testing from '@/pages/Testing';
import Visuals from '@/pages/Visuals';
import { isOnlyViewerSelector } from '@/store/selectors';
import { getActivePageAndMatch } from '@/utils/routes';

import ProjectTitle from './components/ProjectTitle';
import SkillSubHeader from './components/SkillSubHeader';
import DiagramSync from './contexts/DiagramSync';

const PAGES_MATCHES = {
  test: ['/test/:diagramID?'],
  tools: ['/tools'],
  canvas: ['/canvas/:diagramID?'],
  migrate: ['/migrate'],
  visuals: ['/visuals'],
  publish: ['/publish'],
};

const TIMEOUT_COUNT = 5 * 60 * 1000;

function RenderCanvas({ diagramID, isTesting }) {
  return (
    <>
      {!isTesting && <DiagramSync diagramID={diagramID} />}
      <ManagerProvider value={getManager}>
        <EditPermissionProvider isTesting={isTesting}>
          <ShortcutModalProvider>
            <SettingsModalProvider>
              <CanvasHeader />
              <CanvasMenu />
              <Canvas isTesting={isTesting} />
              <Testing render />
            </SettingsModalProvider>
          </ShortcutModalProvider>
        </EditPermissionProvider>
      </ManagerProvider>
    </>
  );
}

function Skill({ match, error, diagramID, activePage, activeSkill = {}, goToDashboard, updateProjectName, isOnlyViewer }) {
  const [isIdle, onIdle, onActive] = useEnableDisable();
  const [canEditCanvas] = usePermissions(FEATURE_IDS.EDIT_CANVAS);

  const idleTimer = React.useRef();
  const isTesting = activePage === 'test';

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
    <>
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
        header={<ProjectTitle title={activeSkill.name} canEdit={canEditCanvas && !isTesting} onChange={updateProjectName} />}
        userMenu={false}
        canScroll={false}
        subHeader={<SkillSubHeader showPublish={canEditCanvas} activePage={activePage} />}
        onNavigateBack={goToDashboard}
      >
        <Switch>
          <PrivateRoute
            path={[`${match.path}/test/:diagramID?`, `${match.path}/canvas/:diagramID?`]}
            component={RenderCanvas}
            diagramID={diagramID}
            isTesting={isTesting}
          />

          <PrivateRoute path={`${match.path}/tools`} component={Business} />

          <PrivateRoute path={`${match.path}/migrate`} component={Migrate} />

          <PrivateRoute path={`${match.path}/visuals`} component={Visuals} />

          <PrivateRoute path={`${match.path}/publish`} component={Publish} />

          <Redirect to={`${match.path}/canvas`} />
        </Switch>
      </Page>
    </>
  );
}

const mapStateToProps = {
  activeSkill: activeSkillSelector,
  isConnected: Realtime.isRealtimeConnectedSelector,
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
    ProjectLockGate,
    WorkspaceLoadingGate,
    RealtimeLoadingGate
  )
)(Skill);
