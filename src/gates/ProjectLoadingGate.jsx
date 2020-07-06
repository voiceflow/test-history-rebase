import React from 'react';

import LoadingGate from '@/components/LoadingGate';
import { setError } from '@/ducks/modal';
import * as Project from '@/ducks/project';
import * as Skill from '@/ducks/skill';
import * as Thread from '@/ducks/thread';
import { connect } from '@/hocs';
import { loadSkill } from '@/store/sideEffects';

const ProjectLoadingGate = ({ isProjectLoaded, loadProject, setupProjectConnection, loadThreads, projectID, children }) => {
  React.useEffect(() => {
    setupProjectConnection();
    loadThreads(projectID);
  }, [projectID, setupProjectConnection]);

  return (
    <LoadingGate label="Project" isLoaded={isProjectLoaded} load={loadProject}>
      {children}
    </LoadingGate>
  );
};

const mapStateToProps = {
  activeSkill: Skill.activeSkillSelector,
  projectID: Skill.activeProjectIDSelector,
};

const mapDispatchToProps = {
  loadSkill,
  setError,
  setupProjectSocketConnection: Project.setupProjectSocketConnection,
  loadThreads: Thread.loadThreads,
};

// eslint-disable-next-line no-shadow
const mergeProps = ({ activeSkill, projectID }, { loadSkill, setError, setupProjectSocketConnection }, { versionID, diagramID }) => ({
  isProjectLoaded: activeSkill && activeSkill.id === versionID,
  loadProject: () => loadSkill(versionID, diagramID).catch(setError),
  setupProjectConnection: () => (projectID ? setupProjectSocketConnection(projectID) : null),
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ProjectLoadingGate);
