import React from 'react';
import { ActionCreators } from 'redux-undo';

import LoadingGate from '@/components/LoadingGate';
import { FeatureFlag } from '@/config/features';
import * as Creator from '@/ducks/creator';
import { activeDiagramIDSelector } from '@/ducks/skill';
import { connect } from '@/hocs';
import { useFeature } from '@/hooks';
import { initializeCreatorForDiagram } from '@/store/sideEffects';
import { initializeCreatorForDiagram as initializeCreatorForDiagramV2 } from '@/store/sideEffectsV2';
import { Action } from '@/store/types';
import { ConnectedProps, MergeArguments } from '@/types';

const RawDiagramLoadingGate: React.FC<ConnectedDiagramLoadingGateProps> = ({
  diagramID,
  creatorDiagramID,
  isDiagramLoaded,
  loadDiagram,
  loadDiagramV2,
  clearHistory,
  children,
}) => {
  const prevDiagramID = React.useRef(diagramID);
  const dataRefactor = useFeature(FeatureFlag.DATA_REFACTOR);
  const load = dataRefactor.isEnabled ? loadDiagramV2 : loadDiagram;

  // reset history if switching between diagrams
  React.useEffect(() => {
    if (isDiagramLoaded && prevDiagramID.current !== creatorDiagramID) {
      prevDiagramID.current = creatorDiagramID!;
      clearHistory();
    }
  }, [isDiagramLoaded, creatorDiagramID, clearHistory]);

  return (
    <LoadingGate label="Diagrams" isLoaded={isDiagramLoaded} load={load}>
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
  loadDiagramV2: initializeCreatorForDiagramV2,
  clearHistory: ActionCreators.clearHistory as () => Action,
};

const mergeProps = (
  ...[{ diagramID, creatorDiagramID }, { loadDiagram, loadDiagramV2 }]: MergeArguments<typeof mapStateToProps, typeof mapDispatchToProps>
) => ({
  isDiagramLoaded: creatorDiagramID === diagramID,
  loadDiagram: () => loadDiagram(diagramID),
  loadDiagramV2: () => loadDiagramV2(diagramID),
});

type ConnectedDiagramLoadingGateProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps, typeof mergeProps>;

const DiagramLoadingGate = connect(mapStateToProps, mapDispatchToProps, mergeProps)(RawDiagramLoadingGate);

export default DiagramLoadingGate;
