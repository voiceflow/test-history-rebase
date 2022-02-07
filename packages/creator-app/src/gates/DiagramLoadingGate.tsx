import React from 'react';

import LoadingGate from '@/components/LoadingGate';
import { FeatureFlag } from '@/config/features';
import * as Creator from '@/ducks/creator';
import * as CreatorV2 from '@/ducks/creatorV2';
import * as Prototype from '@/ducks/prototype';
import { withFeatureSwitcher } from '@/hocs';
import { useDispatch, useSelector } from '@/hooks';

import DiagramSubscriptionGate from './DiagramSubscriptionGate';

const DiagramLoadingGate: React.FC = ({ children }) => {
  const creatorDiagramID = useSelector(CreatorV2.activeDiagramIDSelector);
  const prototypeMode = useSelector(Prototype.activePrototypeModeSelector);
  const loadDiagram = useDispatch(Creator.initializeCreatorForActiveDiagram);

  return (
    <LoadingGate label="Diagrams" isLoaded={!!creatorDiagramID} load={loadDiagram} withoutSpinner={prototypeMode === Prototype.PrototypeMode.DISPLAY}>
      {children}
    </LoadingGate>
  );
};

export default withFeatureSwitcher(FeatureFlag.ATOMIC_ACTIONS_PHASE_2, DiagramSubscriptionGate)(DiagramLoadingGate);
