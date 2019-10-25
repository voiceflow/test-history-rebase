import React from 'react';
import { Helmet } from 'react-helmet';
import { Alert } from 'reactstrap';

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
import { connect } from '@/hocs';

import ProjectTitle from './components/ProjectTitle';
import SkillSubHeader from './components/SkillSubHeader';
import DiagramSync from './contexts/DiagramSync';
import ProjectLoadingGate from './contexts/ProjectLoadingGate';
import ProjectLockGate from './contexts/ProjectLockGate';
// import RealtimeLoadingGate from './contexts/RealtimeLoadingGate';

class Skill extends React.PureComponent {
  timeMounted = null;

  trackCanvasTime() {
    const { skill } = this.props;

    const timeUnmounted = new Date();
    if (skill) {
      this.props.trackSessionTime(timeUnmounted - this.timeMounted, skill.skill_id);
    }
    this.timeMounted = null;
  }

  componentDidMount() {
    /* Logic for detecting when page refreshed */
    // eslint-disable-next-line compat/compat
    if (window.performance && window.performance.navigation.type === 1) {
      this.trackCanvasTime();
    }
  }

  renderPage() {
    const {
      page,
      secondaryPage,
      match: {
        params: { diagram_id: diagramID },
      },
    } = this.props;
    const isTesting = page === 'test';

    switch (page) {
      case 'canvas':
      case 'test':
        return (
          <>
            {!isTesting && <DiagramSync diagramID={diagramID} />}
            <TestingModeProvider value={isTesting}>
              <ShortcutModalProvider>
                <SettingsModalProvider>
                  <CanvasHeader />
                  <CanvasMenu />
                  <Canvas page={page} />
                  <Testing render />
                </SettingsModalProvider>
              </ShortcutModalProvider>
            </TestingModeProvider>
          </>
        );
      case 'tools':
        return <Business {...this.props} page={secondaryPage} toggleUpgrade={this.toggleUpgrade} />;
      case 'publish':
        return <Publish {...this.props} page={secondaryPage} />;
      case 'logs':
        return <Logs {...this.props} />;
      case 'visuals':
        return <Visuals {...this.props} page={secondaryPage} />;
      case 'migrate':
        return <Migrate {...this.props} />;
      default:
        return null;
    }
  }

  render() {
    const {
      error,
      updateProjectName,
      goToDashboard,
      activeSkill = {},
      page,
      match: {
        params: { skill_id: skillID, diagram_id: diagramID },
      },
    } = this.props;

    if (error) {
      return (
        <div className="super-center w-100 h-100">
          <Alert color="danger">{error}</Alert>
        </div>
      );
    }

    return (
      <ProjectLockGate skillID={skillID}>
        {() => (
          <ProjectLoadingGate skillID={skillID} diagramID={diagramID}>
            {() => (
              // <RealtimeLoadingGate>
              //   {() => (
              <>
                <Helmet>
                  <title>{activeSkill.name || 'Voiceflow Creator'}</title>
                </Helmet>
                <Page
                  onNavigateBack={goToDashboard}
                  header={<ProjectTitle title={activeSkill.name} onChange={updateProjectName} />}
                  subHeader={<SkillSubHeader activePage={page} />}
                  canScroll={false}
                  userMenu={false}
                >
                  {this.renderPage()}
                </Page>
                <DragLayer />
              </>
              //   )}
              // </RealtimeLoadingGate>
            )}
          </ProjectLoadingGate>
        )}
      </ProjectLockGate>
    );
  }
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(Skill);
