import React from 'react';
import { ActionCreators } from 'redux-undo';

import LoadingGate from '@/components/LoadingGate';
import * as Creator from '@/ducks/creator';
import { activeDiagramIDSelector } from '@/ducks/skill';
import { connect } from '@/hocs';
import { initializeCreatorForDiagram } from '@/store/sideEffects';
import { Action } from '@/store/types';
import { ConnectedProps, MergeArguments } from '@/types';

const RawDiagramLoadingGate: React.FC<ConnectedDiagramLoadingGateProps> = ({
  diagramID,
  creatorDiagramID,
  isDiagramLoaded,
  loadDiagram,
  clearHistory,
  children,
}) => {
  const prevDiagramID = React.useRef(diagramID);

  // reset history if switching between diagrams
  React.useEffect(() => {
    if (isDiagramLoaded && prevDiagramID.current !== creatorDiagramID) {
      prevDiagramID.current = creatorDiagramID!;
      clearHistory();
    }
  }, [isDiagramLoaded, creatorDiagramID, clearHistory]);

  return (
    <LoadingGate label="Diagrams" isLoaded={isDiagramLoaded} load={loadDiagram}>
      {children}
    </LoadingGate>
  );
};

const mapStateToProps = {
  diagramID: activeDiagramIDSelector,
  creatorDiagramID: Creator.creatorDiagramIDSelector,
};

const mapDispatchToProps = {
  loadDiagram: initializeCreatorForDiagram,
  clearHistory: ActionCreators.clearHistory as () => Action,
};

const mergeProps = (...[{ diagramID, creatorDiagramID }, { loadDiagram }]: MergeArguments<typeof mapStateToProps, typeof mapDispatchToProps>) => ({
  isDiagramLoaded: creatorDiagramID === diagramID,
  loadDiagram: () => loadDiagram(diagramID),
});

type ConnectedDiagramLoadingGateProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps, typeof mergeProps>;

const DiagramLoadingGate = connect(mapStateToProps, mapDispatchToProps, mergeProps)(RawDiagramLoadingGate);

export default DiagramLoadingGate;
