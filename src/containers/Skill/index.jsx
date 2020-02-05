import React from 'react';
import { Helmet } from 'react-helmet';
import IdleTimer from 'react-idle-timer';
import { Redirect, Switch } from 'react-router-dom';
import { Alert } from 'reactstrap';
import { compose } from 'recompose';

import PrivateRoute from '@/Routes/PrivateRoute';
import Page from '@/components/Page';
import { FEATURE_IDS } from '@/constants';
import Business from '@/containers/Business';
import Canvas from '@/containers/CanvasV2';
import CanvasMenu from '@/containers/CanvasV2/components/CanvasMenu';
import { EditPermissionProvider, ManagerProvider, ShortcutModalProvider } from '@/containers/CanvasV2/contexts';
import CanvasHeader from '@/containers/CanvasV2/header';
import { getManager } from '@/containers/CanvasV2/managers';
import InactivityModal from '@/containers/Inactivity';
import Publish from '@/containers/Publish';
import Migrate from '@/containers/Publish/Amazon/Migrate';
import { SettingsModalProvider } from '@/containers/Settings/contexts';
import Testing from '@/containers/Testing';
import Visuals from '@/containers/Visuals';
import { usePermissions } from '@/contexts/RolePermissionsContext';
import { trackSessionTime } from '@/ducks/analytics';
import { updateProjectName } from '@/ducks/project';
import * as Realtime from '@/ducks/realtime';
import { goToDashboard } from '@/ducks/router';
import { activeSkillSelector, saveSkillSettings } from '@/ducks/skill';
import { ProjectLoadingGate, ProjectLockGate, RealtimeLoadingGate, WorkspaceLoadingGate } from '@/gates';
import { connect, withBatchLoadingGate } from '@/hocs';
import { useEnableDisable } from '@/hooks';
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

function Skill(props) {
  const { match, error, diagramID, activePage, activeSkill = {}, goToDashboard, updateProjectName, isOnlyViewer } = props;
  const [isIdle, onIdle, onActive] = useEnableDisable();
  const [canEditCanvas] = usePermissions(FEATURE_IDS.EDIT_CANVAS);

  const timeMounted = null;
  const idleTimer = React.useRef();
  const isTesting = activePage === 'test';

  React.useEffect(() => {
    if (window.performance?.navigation.type === 1) {
      const { skill } = props;

      const timeUnmounted = new Date();

      skill && props.trackSessionTime(timeUnmounted - timeMounted, skill.skill_id);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const setActive = React.useCallback(() => {
    onActive();
    idleTimer.current.reset();
  }, [onActive]);

  const setIdle = React.useCallback(() => {
    onIdle();
    idleTimer.current.pause();
  }, [onIdle]);

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
  trackSessionTime,
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
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  ),
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
