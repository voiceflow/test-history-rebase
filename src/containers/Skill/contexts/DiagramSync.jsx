import React from 'react';

import { goToRootDiagram } from '@/ducks/router';
import { activeSkillSelector, updateDiagramID } from '@/ducks/skill';
import { connect } from '@/hocs';

const DiagramSync = ({ isDiagramSynced, diagramID, goToRootDiagram, updateDiagramID }) => {
  React.useEffect(() => {
    if (!diagramID) {
      goToRootDiagram();
    } else if (!isDiagramSynced) {
      updateDiagramID(diagramID);
    }
  }, [diagramID, isDiagramSynced]);

  return null;
};

const mapStateToProps = {
  activeSkill: activeSkillSelector,
};

const mapDispatchToProps = {
  updateDiagramID,
  goToRootDiagram,
};

const mergeProps = ({ activeSkill }, _, { diagramID }) => ({
  isDiagramSynced: activeSkill.diagramID === diagramID,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(DiagramSync);
