import React from 'react';

import LoadingGate from '@/components/LoadingGate';
import * as Creator from '@/ducks/creator';
import * as Prototype from '@/ducks/prototype';
import { connect } from '@/hocs';
import { ConnectedProps } from '@/types';

import RealtimeDiagramSubscription from './RealtimeDiagramSubscription';

const DiagramLoadingGate: React.FC<ConnectedDiagramLoadingGateProps> = ({ children, loadDiagram, prototypeMode, creatorDiagramID }) => (
  <LoadingGate label="Diagrams" isLoaded={!!creatorDiagramID} load={loadDiagram} withoutSpinner={prototypeMode === Prototype.PrototypeMode.DISPLAY}>
    <RealtimeDiagramSubscription />
    {children}
  </LoadingGate>
);

const mapStateToProps = {
  creatorDiagramID: Creator.creatorDiagramIDSelector,
  prototypeMode: Prototype.activePrototypeModeSelector,
};

const mapDispatchToProps = {
  loadDiagram: Creator.initializeCreatorForActiveDiagram,
};

type ConnectedDiagramLoadingGateProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(DiagramLoadingGate);
