import React from 'react';

import * as Router from '@/ducks/router';
import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';
import { ConnectedProps, MergeArguments } from '@/types';

type DiagramSyncProps = {
  diagramID: string;
};

const DiagramSync: React.FC<DiagramSyncProps & ConnectedDiagramSyncProps> = ({
  isDiagramSynced,
  diagramID,
  redirectToRootDiagram,
  updateDiagramID,
}) => {
  React.useEffect(() => {
    if (!diagramID) {
      redirectToRootDiagram();
    } else if (!isDiagramSynced) {
      updateDiagramID(diagramID);
    }
  }, [diagramID, isDiagramSynced]);

  return null;
};

const mapStateToProps = {
  activeSkill: Skill.activeSkillSelector,
};

const mapDispatchToProps = {
  updateDiagramID: Skill.updateDiagramID,
  redirectToRootDiagram: Router.redirectToRootDiagram,
};

const mergeProps = (...[{ activeSkill }, , { diagramID }]: MergeArguments<typeof mapStateToProps, typeof mapDispatchToProps, DiagramSyncProps>) => ({
  isDiagramSynced: activeSkill.diagramID === diagramID,
});

type ConnectedDiagramSyncProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps, typeof mergeProps>;

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(DiagramSync) as React.FC<DiagramSyncProps>;
