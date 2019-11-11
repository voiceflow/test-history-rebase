import React from 'react';
import { Helmet } from 'react-helmet';
import { Redirect, Switch } from 'react-router-dom';
import { Alert } from 'reactstrap';
import { compose } from 'recompose';

import PrivateRoute from '@/Routes/PrivateRoute';
import Page from '@/components/Page';
import DragLayer from '@/componentsV2/DragLayer';
import Business from '@/containers/Business';
import Canvas from '@/containers/CanvasV2';
import CanvasMenu from '@/containers/CanvasV2/components/CanvasMenu';
import { SettingsModalProvider, ShortcutModalProvider, TestingModeProvider } from '@/containers/CanvasV2/contexts';
import CanvasHeader from '@/containers/CanvasV2/header';
import Logs from '@/containers/Logs';
import Publish from '@/containers/Publish';
import Migrate from '@/containers/Publish/Amazon/Migrate';
import Testing from '@/containers/Testing';
import Visuals from '@/containers/Visuals';
import { trackSessionTime } from '@/ducks/analytics';
import { updateProjectName } from '@/ducks/project';
import { goToDashboard } from '@/ducks/router';
import { activeSkillSelector, saveSkillSettings } from '@/ducks/skill';
import { ProjectLoadingGate, ProjectLockGate } from '@/gates';
import { connect, withBatchLoadingGate } from '@/hocs';
import { getActivePageAndMatch } from '@/utils/routes';

import ProjectTitle from './components/ProjectTitle';
import SkillSubHeader from './components/SkillSubHeader';
import DiagramSync from './contexts/DiagramSync';

const PAGES_MATCHES = {
  test: ['/test/:diagramID?'],
  logs: ['/creator_logs'],
  tools: ['/tools'],
  canvas: ['/canvas/:diagramID?'],
  migrate: ['/migrate'],
  visuals: ['/visuals'],
  publish: ['/publish'],
};

function RenderCanvas({ diagramID, isTesting }) {
  return (
    <>
      {!isTesting && <DiagramSync diagramID={diagramID} />}
      <TestingModeProvider value={isTesting}>
        <ShortcutModalProvider>
          <SettingsModalProvider>
            <CanvasHeader />
            <CanvasMenu />
            <Canvas isTesting={isTesting} />
            <Testing render />
          </SettingsModalProvider>
        </ShortcutModalProvider>
      </TestingModeProvider>
    </>
  );
}

function Skill(props) {
  const { match, error, diagramID, activePage, activeSkill = {}, goToDashboard, updateProjectName } = props;

  const timeMounted = null;

  React.useEffect(() => {
    if (window.performance?.navigation.type === 1) {
      const { skill } = props;

      const timeUnmounted = new Date();

      skill && props.trackSessionTime(timeUnmounted - timeMounted, skill.skill_id);
    }
  }, []);

  if (error) {
    return (
      <div className="super-center w-100 h-100">
        <Alert color="danger">{error}</Alert>
      </div>
    );
  }
  const isTesting = activePage === 'test';

  return (
    <>
      <Helmet>
        <title>{activeSkill.name || 'Voiceflow Creator'}</title>
      </Helmet>

      <Page
        header={<ProjectTitle title={activeSkill.name} onChange={updateProjectName} />}
        userMenu={false}
        canScroll={false}
        subHeader={<SkillSubHeader activePage={activePage} />}
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

          <PrivateRoute path={`${match.path}/creator_logs`} component={Logs} />

          <Redirect to={`${match.path}/canvas`} />
        </Switch>
      </Page>
      <DragLayer />
    </>
  );
}

const mapStateToProps = {
  activeSkill: activeSkillSelector,
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
    [ProjectLockGate, ({ match }) => ({ versionID: match.params?.versionID })],
    [
      ProjectLoadingGate,
      ({ match, location }) => {
        const { activePage, activePageMatch } = getActivePageAndMatch(PAGES_MATCHES, location.pathname, match.path);

        return {
          diagramID: activePageMatch?.params?.diagramID,
          activePage,
        };
      },
    ]
  )
)(Skill);
