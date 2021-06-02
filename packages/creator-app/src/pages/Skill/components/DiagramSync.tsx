import React from 'react';

import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import { connect } from '@/hocs';
import { ConnectedProps, MergeArguments } from '@/types';

type DiagramSyncProps = {
  diagramID: string | null;
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
  activeDiagramID: Session.activeDiagramIDSelector,
};

const mapDispatchToProps = {
  updateDiagramID: Session.setActiveDiagramID,
  redirectToRootDiagram: Router.redirectToRootDiagram,
};

const mergeProps = (
  ...[{ activeDiagramID }, , { diagramID }]: MergeArguments<typeof mapStateToProps, typeof mapDispatchToProps, DiagramSyncProps>
) => ({
  isDiagramSynced: activeDiagramID === diagramID,
});

type ConnectedDiagramSyncProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps, typeof mergeProps>;

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(DiagramSync) as React.FC<DiagramSyncProps>;
