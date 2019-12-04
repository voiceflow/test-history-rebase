import React from 'react';

import LoadingGate from '@/components/LoadingGate';
import { setError } from '@/ducks/modal';
import { activeSkillSelector } from '@/ducks/skill';
import { connect } from '@/hocs';
import { loadSkill } from '@/store/sideEffects';

const ProjectLoadingGate = ({ isProjectLoaded, loadProject, children }) => (
  <LoadingGate label="Project" isLoaded={isProjectLoaded} load={loadProject}>
    {children}
  </LoadingGate>
);

const mapStateToProps = {
  activeSkill: activeSkillSelector,
};

const mapDispatchToProps = {
  loadSkill,
  setError,
};

const mergeProps = ({ activeSkill }, { loadSkill, setError }, { versionID, diagramID }) => ({
  isProjectLoaded: activeSkill && activeSkill.id === versionID,
  loadProject: () => loadSkill(versionID, diagramID).catch(setError),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(ProjectLoadingGate);
