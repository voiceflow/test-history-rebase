import React from 'react';

import LoadingGate from '@/components/LoadingGate';
import { creatorStateSelector } from '@/ducks/creator';
import { activeDiagramIDSelector } from '@/ducks/skill';
import { connect } from '@/hocs';
import { withLoadingGate } from '@/hocs/withLoadingGate';
import { initializeCreatorForDiagram } from '@/store/sideEffects';

const RawDiagramLoadingGate = ({ isDiagramLoaded, loadDiagram, children }) => (
  <LoadingGate label="Diagrams" isLoaded={isDiagramLoaded} load={loadDiagram}>
    {children}
  </LoadingGate>
);

const mapStateToProps = {
  diagramID: activeDiagramIDSelector,
  creator: creatorStateSelector,
};

const mapDispatchToProps = {
  loadDiagram: initializeCreatorForDiagram,
};

const mergeProps = ({ diagramID, creator }, { loadDiagram }) => ({
  isDiagramLoaded: creator.diagramID === diagramID,
  loadDiagram: () => loadDiagram(diagramID),
});

const DiagramLoadingGate = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(RawDiagramLoadingGate);

export default DiagramLoadingGate;

export const withDiagramLoaded = withLoadingGate(DiagramLoadingGate);
