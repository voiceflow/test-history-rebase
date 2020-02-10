import React from 'react';
import { ActionCreators } from 'redux-undo';

import LoadingGate from '@/components/LoadingGate';
import * as Creator from '@/ducks/creator';
import { activeDiagramIDSelector } from '@/ducks/skill';
import { connect } from '@/hocs';
import { withLoadingGate } from '@/hocs/withLoadingGate';
import { initializeCreatorForDiagram } from '@/store/sideEffects';

const RawDiagramLoadingGate = ({ diagramID, creatorDiagramID, isDiagramLoaded, loadDiagram, clearHistory, children }) => {
  const prevDiagramID = React.useRef(diagramID);

  // reset history if switching between diagrams
  React.useEffect(() => {
    if (isDiagramLoaded && prevDiagramID.current !== creatorDiagramID) {
      prevDiagramID.current = creatorDiagramID;
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
  clearHistory: ActionCreators.clearHistory,
};

const mergeProps = ({ diagramID, creatorDiagramID }, { loadDiagram }) => ({
  isDiagramLoaded: creatorDiagramID === diagramID,
  loadDiagram: () => loadDiagram(diagramID),
});

const DiagramLoadingGate = connect(mapStateToProps, mapDispatchToProps, mergeProps)(RawDiagramLoadingGate);

export default DiagramLoadingGate;

export const withDiagramLoaded = withLoadingGate(DiagramLoadingGate);
